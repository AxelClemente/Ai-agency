'use client'

import { useState} from 'react'
import { HelpCircle, LifeBuoy,CreditCard, QrCode, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

// Importar todos los componentes necesarios
import BillingSection from '../components/landing-page/billing-section'
import FAQSection from '../components/landing-page/faq-section'
import HelpSection from '../components/landing-page/help'
import QRSection from '../components/landing-page/qr-section'
import { ShareAppModal } from '../components/landing-page/share-app'

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  
  const t = useTranslations('BusinessDashboard.about')

  const renderContent = () => {
    switch(activeSection) {
      case 'faq':
        return <FAQSection />
      case 'help':
        return <HelpSection />
      case 'billing':
        return <BillingSection />
      case 'qr':
        return <QRSection />
      case 'share':
        setIsShareModalOpen(true)
        setActiveSection(null)
        return null
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* FAQ Section */}
            <div 
              onClick={() => setActiveSection('faq')}
              className="p-6 bg-white rounded-lg border border-gray-200 flex flex-col items-center text-center cursor-pointer hover:border-gray-300 transition-colors"
            >
              <HelpCircle className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('faq')}</h3>
              <p className="text-sm">{t('faqDescription')}</p>
            </div>

            {/* Help Section */}
            <div 
              onClick={() => setActiveSection('help')}
              className="p-6 bg-white rounded-lg border border-gray-200 flex flex-col items-center text-center cursor-pointer hover:border-gray-300 transition-colors"
            >
              <LifeBuoy className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('help')}</h3>
              <p className="text-sm">{t('helpDescription')}</p>
            </div>

            {/* Billing Section */}
            <div 
              onClick={() => setActiveSection('billing')}
              className="p-6 bg-white rounded-lg border border-gray-200 flex flex-col items-center text-center cursor-pointer hover:border-gray-300 transition-colors"
            >
              <CreditCard className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('billing')}</h3>
              <p className="text-sm">{t('billingDescription')}</p>
            </div>

            {/* QR Section */}
            <div 
              onClick={() => setActiveSection('qr')}
              className="p-6 bg-white rounded-lg border border-gray-200 flex flex-col items-center text-center cursor-pointer hover:border-gray-300 transition-colors"
            >
              <QrCode className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('qrAndLinks')}</h3>
              <p className="text-sm">{t('qrDescription')}</p>
            </div>

            {/* Share Section */}
            <div 
              onClick={() => setIsShareModalOpen(true)}
              className="p-6 bg-white rounded-lg border border-gray-200 flex flex-col items-center text-center cursor-pointer hover:border-gray-300 transition-colors"
            >
              <Share2 className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('shareApp')}</h3>
              <p className="text-sm">{t('shareDescription')}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="p-0 md:p-8">
      <h3 className="text-center text-[24px] font-[700] leading-[32px] mb-6 pt-6 md:hidden">
        {t('title')}
      </h3>

      <div className="mx-0 md:mx-8">
        <div className="mb-4 px-4 md:px-0 hidden md:block">
          <h2 className="text-[40px] font-[800] leading-[55px]">
            {activeSection ? t(activeSection) : t('title')}
          </h2>
        </div>
        
        <div className="space-y-0 md:space-y-6">
          {renderContent()}
        </div>
      </div>

      <ShareAppModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  )
}