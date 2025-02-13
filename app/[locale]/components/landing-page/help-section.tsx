'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function HelpSection() {
  const [activeTab, setActiveTab] = useState<'call' | 'write'>('call')
  const t = useTranslations('BusinessDashboard.help')

  return (
    <div className="w-full relative min-h-[600px] md:min-h-[500px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <div className="absolute right-[-370px] -top-[-60px] hidden md:block">
          <img 
            src="/logofideliza.svg" 
            alt="Background" 
            className="w-[1100px] h-[1200px] object-contain opacity-20"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Title - Mobile version */}
        <div className="md:hidden mb-6 px-4">
          <h2 className="!text-[24px] md:text-[40px] font-bold leading-[1.2]">
            {t('title')}
          </h2>
        </div>

        <div className="flex flex-col md:flex-row md:gap-20">
          {/* Left card */}
          <div className="w-full md:w-[514px] min-h-[550px] md:min-h-[500px] bg-white 
              rounded-none md:rounded-xl border-x-0 border-t border-b md:border 
              border-gray-100 shadow-none md:shadow-[0_4px_20px_rgba(0,0,0,0.05)] 
              px-4 md:px-6 py-6">
            <div className="h-full flex flex-col">
              {/* Top buttons */}
              <div className="flex justify-center gap-4 mb-12 md:mb-6">
                <button 
                  className={`
                    transition-colors 
                    text-[24px]
                    font-[700]
                    leading-[33px]
                    ${activeTab === 'call' ? 'text-black' : 'text-gray-400'}
                  `}
                  onClick={() => setActiveTab('call')}
                >
                  {t('callUs')}
                </button>
                <span className="text-gray-400 text-[24px] font-[700] leading-[33px]">|</span>
                <button 
                  className={`
                    transition-colors 
                    text-[24px]
                    font-[700]
                    leading-[33px]
                    ${activeTab === 'write' ? 'text-black' : 'text-gray-400'}
                  `}
                  onClick={() => setActiveTab('write')}
                >
                  {t('writeUs')}
                </button>
              </div>
              
              {activeTab === 'call' ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-24 md:space-y-16">
                  <img 
                    src="/phone-icon.svg" 
                    alt="Phone" 
                    className="w-16 h-16"
                  />
                  <button className="w-full h-[78px] rounded-[100px] bg-black text-white hover:bg-gray-800 transition-colors">
                    {t('callUs')}
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between pt-6">
                  <div className="w-full space-y-4">
                    <div className="relative">
                      <Image
                        src="/customer.svg"
                        alt="User"
                        width={18}
                        height={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                      />
                      <input
                        type="text"
                        placeholder={t('namePlaceholder')}
                        className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:border-gray-200"
                      />
                    </div>

                    <div className="relative">
                      <Image
                        src="/email.-icon.svg"
                        alt="Email"
                        width={18}
                        height={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                      />
                      <input
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:border-gray-200"
                      />
                    </div>

                    <textarea
                      placeholder={t('messagePlaceholder')}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 focus:outline-none focus:border-gray-200 resize-none"
                    />
                  </div>
                  <div className="w-full mt-8">
                    <button className="w-full h-[78px] rounded-[100px] bg-black text-white hover:bg-gray-800 transition-colors">
                      {t('sendButton')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right card - desktop only */}
          <div className="flex-1 hidden md:block md:mt-0 md:text-left">
            <h2 className="!text-[40px] !font-[800] !leading-[55px] mb-4">
              {t('title')}
            </h2>
            <p className="!text-[24px] !font-[800] !leading-[33px]">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}