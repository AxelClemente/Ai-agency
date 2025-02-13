import HeroSection from '@/app/[locale]/components/landing-page/hero'
import VideoSection from '@/app/[locale]/components/landing-page/video'
import FAQSection from '@/app/[locale]/components/landing-page/faq'
import { MainHeader } from '@/app/[locale]/components/layout/main-header'
import { MobileMainHeader } from '@/app/[locale]/components/layout/mobile-main-header'
import { Footer } from '@/app/[locale]/components/layout/footer'
import { redirect } from 'next/navigation'

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!['en', 'es', 'fr'].includes(locale)) {
    redirect('/en');
  }

  return (
    <main className="bg-white">
      <div className="md:hidden">
        <MobileMainHeader />
      </div>
      <div className="hidden md:block">
        <MainHeader />
      </div>
      <div className="px-4 md:container md:mx-auto md:px-8">
        <HeroSection />
        <VideoSection />
        <FAQSection />
        <Footer />
      </div>
    </main>
  )
}

