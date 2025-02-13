import type { Metadata } from "next";
import { Open_Sans, Poppins } from 'next/font/google';
import { AuthProvider } from "@/app/[locale]/components/providers/auth-provider";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster"
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import { metadata as appMetadata } from '@/app/metadata-config';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-open-sans',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: appMetadata.landing.title ?? "Fideliza",
  description: appMetadata.landing.description ?? "Your Local Favorites App",
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${openSans.variable} ${poppins.variable} font-sans antialiased
          overflow-x-hidden
          [&_h1]:text-h1
          [&_h2]:text-h2
          [&_h3]:text-h3
          text-body-regular-1`}
      >
        <NextIntlClientProvider 
          locale={locale}
          messages={messages}
          timeZone="America/New_York"
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
