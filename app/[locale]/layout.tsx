import type { Metadata } from "next";
import { Inter, Poppins } from 'next/font/google';
import { AuthProvider } from "@/app/[locale]/components/providers/auth-provider";
import "@/app/globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { metadata as appMetadata } from '@/app/metadata-config';
import { Toaster } from "sonner"
import { WebSocketProvider } from '@/components/websocket-provider'

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

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <WebSocketProvider>
            <AuthProvider>
              <div className="flex flex-col min-h-screen">
                <Toaster position="bottom-right" richColors closeButton />
                {children}
              </div>
            </AuthProvider>
          </WebSocketProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
