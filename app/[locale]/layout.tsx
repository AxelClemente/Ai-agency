import type { Metadata } from "next";
import { Inter, Poppins } from 'next/font/google';
import { AuthProvider } from "@/app/[locale]/components/providers/auth-provider";
import "@/app/globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { metadata as appMetadata } from '@/app/metadata-config';
import { Toaster } from "sonner"

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: appMetadata.landing.title ?? "Writer - Dream big. Build fast.",
  description: appMetadata.landing.description ?? "The only end-to-end agent builder platform that unites IT & business",
  icons: {
    icon: '/favicon.svg',
  }
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }, { locale: 'fr' }];
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (_) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        suppressHydrationWarning={true}
        className={`${poppins.variable} ${inter.variable} font-poppins antialiased overflow-x-hidden`}
      >
        <NextIntlClientProvider 
          locale={locale}
          messages={messages}
          timeZone="America/New_York"
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster position="bottom-right" richColors closeButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
