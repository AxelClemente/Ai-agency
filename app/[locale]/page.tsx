import { redirect } from 'next/navigation'
import Header from "@/app/[locale]/components/new-lading-page/header"
import HeroSection from "@/app/[locale]/components/new-lading-page/hero-section"
import TrustedBySection from "@/app/[locale]/components/new-lading-page/trusted-by-section"
import AgentsSection from "@/app/[locale]/components/new-lading-page/agents-section"
import TestimonialsSection from "@/app/[locale]/components/new-lading-page/testimonials-section"
//import IndustriesSection from "@/app/[locale]/components/new-lading-page/industries-section"
//import CaseStudiesSection from "@/app/[locale]/components/new-lading-page/case-studies-section"
//import PlatformSection from "@/app/[locale]/components/new-lading-page/platform-section"
//import TechnologySection from "@/app/[locale]/components/new-lading-page/technology-section"
import EmpowermentSection from "@/app/[locale]/components/new-lading-page/empowerment-section"
import Footer from "@/app/[locale]/components/new-lading-page/footer"

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
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <div id="hero">
          <HeroSection />
        </div>
        <TrustedBySection />
        <AgentsSection />
        <TestimonialsSection /> 
        {/* <IndustriesSection />  */}
        <EmpowermentSection /> 
        {/* <CaseStudiesSection /> */}
        {/* <PlatformSection />  */}
        {/* <TechnologySection /> */}
      </main>
      <Footer />
    </div>
  )
}

