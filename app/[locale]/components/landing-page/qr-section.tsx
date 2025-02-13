'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function QRSection() {
  const [activeSection, setActiveSection] = useState<'links' | 'qrs'>('links')
  const t = useTranslations('BusinessDashboard.qr')

  return (
    <div className="w-full">
      {/* Mobile Version - Carousel */}
      <div className="md:hidden">
        {/* Links Section */}
        <div className={`${activeSection === 'links' ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-[250px]">
              <Image
                src="/links.svg"
                alt="Logo gradient"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{t('links.title')}</h3>
                <p className="text-gray-600">{t('links.description')}</p>
              </div>
              <div className="mt-6 flex flex-col items-center gap-4">
                <div className="w-[369px] h-[78px] flex items-center gap-4 bg-gray-50 p-3 rounded-full text-gray-500">
                  <Image 
                    src="/share.svg" 
                    alt="Share icon" 
                    width={20} 
                    height={20} 
                  />
                  http://oursite.com
                </div>
                <button className="w-[369px] h-[78px] bg-black text-white px-6 rounded-full hover:bg-gray-800 transition-colors">
                  Share Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QRs Section */}
        <div className={`${activeSection === 'qrs' ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-[250px]">
              <Image
                src="/qars.svg"
                alt="QR example"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{t('qrs.title')}</h3>
                <p className="text-gray-600">{t('qrs.description')}</p>
              </div>
              <div className="mt-6 flex items-center justify-center">
                <button className="w-[369px] h-[78px] bg-black text-white px-6 rounded-full hover:bg-gray-800 transition-colors">
                  {t('qrs.downloadButton')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          <button 
            onClick={() => setActiveSection('links')}
            className={`w-2 h-2 rounded-full transition-colors ${
              activeSection === 'links' ? 'bg-black' : 'bg-gray-300'
            }`}
          />
          <button 
            onClick={() => setActiveSection('qrs')}
            className={`w-2 h-2 rounded-full transition-colors ${
              activeSection === 'qrs' ? 'bg-black' : 'bg-gray-300'
            }`}
          />
        </div>
      </div>

      {/* Desktop Version - Original layout */}
      <div className="hidden md:block space-y-6">
        {/* Links Section */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="md:flex overflow-hidden">
            <div className="md:w-1/3 h-[250px] md:h-full">
              <Image
                src="/links.svg"
                alt="Logo gradient"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{t('links.title')}</h3>
                <p className="text-gray-600">{t('links.description')}</p>
              </div>
              <div className="mt-6">
                <div className="hidden md:flex md:flex-row items-center gap-4">
                  <div className="flex-1 flex items-center gap-4 bg-gray-50 p-3 rounded-full text-gray-500">
                    <Image 
                      src="/share.svg" 
                      alt="Share icon" 
                      width={20} 
                      height={20} 
                    />
                    http://oursite.com
                  </div>
                  <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
                    Share Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QRs Section */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="md:flex overflow-hidden">
            <div className="md:w-1/3 h-[250px] md:h-full">
              <Image
                src="/qars.svg"
                alt="QR example"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{t('qrs.title')}</h3>
                <p className="text-gray-600">{t('qrs.description')}</p>
              </div>
              <div className="mt-6">
                <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
                  Download QR template for print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}