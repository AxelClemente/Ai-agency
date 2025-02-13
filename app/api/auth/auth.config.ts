import { AuthOptions, User, DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

// Extendemos los tipos base de NextAuth
declare module "next-auth" {
  interface User {
    id: string
    role?: 'BUSINESS' | 'ADMIN' | 'STAFF' | 'CUSTOMER' | null
    location?: string | null
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      role?: 'BUSINESS' | 'ADMIN' | 'STAFF' | 'CUSTOMER' | null
      location?: string | null
      ownerId?: string | null
    } & DefaultSession["user"]
  }
}

interface UserWithPassword extends User {
  password?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        }) as UserWithPassword | null

        if (!user || !user.password) {
          return null
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password)

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        console.log('🔑 New login:', { provider: account?.provider, email: user.email })
      }
      
      const dbUser = await prisma.user.findUnique({
        where: { 
          email: token.email! 
        }
      })
      
      if (dbUser) {
        token.sub = dbUser.id
        token.role = dbUser.role
        token.location = dbUser.location
      }
      
      return token
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as 'BUSINESS' | 'CUSTOMER' | null
        session.user.location = token.location as string | null
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/auth')) {
        return `${baseUrl}${url}`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image,
              }
            });
            console.log('👤 New user created:', user.email)
          }
          return true
        } catch (error) {
          console.error("❌ Error in Google sign in:", error);
          return false;
        }
      }
      if (account?.provider === "facebook") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image || null,
                emailVerified: new Date()
              }
            });
          }
        } catch (error) {
          console.error("Error handling Facebook sign in:", error);
          return false;
        }
      }
      return true;
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/auth?mode=signin',
    error: '/auth?mode=signin',
    newUser: '/auth?mode=signup'
  }
}