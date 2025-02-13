'use client';

import { useTranslations } from 'next-intl';

export default function VideoSection() {
  const t = useTranslations('Video');

  return (
    <section className="w-full py-10 sm:py-20 mt-[-20px] sm:mt-0 relative">
      <div className="space-y-8 sm:space-y-16 relative z-10">
        <div>
          <h2 className="!text-[28px] sm:!text-[64px] !font-[800] !leading-[34px] sm:!leading-[76.8px] !tracking-tight !text-main-dark !font-['Open_Sans']">
            {t('title.part1')}
            <br />
            {t('title.part2')}
          </h2>
        </div>

        {/* Video placeholder */}
        <div className="relative w-full h-[250px] sm:h-[723px] bg-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center">
          <button 
            className="w-20 sm:w-36 h-20 sm:h-36 bg-white rounded-full flex items-center justify-center shadow-lg"
            aria-label={t('playButton')}
          >
            <div className="w-0 h-0 
              border-t-[12px] sm:border-t-[20px] border-t-transparent 
              border-l-[24px] sm:border-l-[40px] border-l-[#422bd1] 
              border-b-[12px] sm:border-b-[20px] border-b-transparent 
              ml-1 sm:ml-2 relative z-10">
            </div>
          </button>
        </div>

        <div>
          <h2 className="!text-[28px] sm:!text-[48px] !font-[800] !leading-[28.8px] sm:!leading-[57.6px] !tracking-tight !text-main-dark !font-['Open_Sans']">
            {t('subtitle.part1')}
            <br className="hidden sm:block" />
            {t('subtitle.part2')}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-8">
          {/* Support Locals Card */}
          <div className="space-y-2 sm:space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl sm:rounded-3xl"></div>
            <h3 className="!text-[24px] sm:!text-[30px] !font-[700] !leading-[28.8px] sm:!leading-[36px] !text-main-dark !font-['Open_Sans']">
              {t('features.support.title')}
            </h3>
            <p className="!text-[14px] sm:!text-[16px] !font-[600] !leading-[16.8px] sm:!leading-[20px] !text-third-gray !font-['Open_Sans']">
              {t('features.support.description')}
            </p>
          </div>

          {/* Easy Access Card */}
          <div className="space-y-2 sm:space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl sm:rounded-3xl"></div>
            <h3 className="!text-[24px] sm:!text-[30px] !font-[700] !leading-[28.8px] sm:!leading-[36px] !text-main-dark !font-['Open_Sans']">
              {t('features.access.title')}
            </h3>
            <p className="!text-[14px] sm:!text-[16px] !font-[600] !leading-[16.8px] sm:!leading-[20px] !text-third-gray !font-['Open_Sans']">
              {t('features.access.description')}
            </p>
          </div>

          {/* Tailored Deals Card */}
          <div className="space-y-2 sm:space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl sm:rounded-3xl"></div>
            <h3 className="!text-[24px] sm:!text-[30px] !font-[700] !leading-[28.8px] sm:!leading-[36px] !text-main-dark !font-['Open_Sans']">
              {t('features.deals.title')}
            </h3>
            <p className="!text-[14px] sm:!text-[16px] !font-[600] !leading-[16.8px] sm:!leading-[20px] !text-third-gray !font-['Open_Sans']">
              {t('features.deals.description')}
            </p>
          </div>
        </div>

        {/* Features Carousel - Solo móvil */}
        <div className="block sm:hidden overflow-x-auto snap-x snap-mandatory -mx-4 px-4">
          <div className="flex gap-4">
            {/* Support Locals Card */}
            <div className="snap-center shrink-0 w-[280px] space-y-2">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <h3 className="!text-[24px] !font-[700] !leading-[28.8px] !text-main-dark !font-['Open_Sans']">
                {t('features.support.title')}
              </h3>
              <p className="!text-[14px] !font-[600] !leading-[16.8px] !text-third-gray !font-['Open_Sans']">
                {t('features.support.description')}
              </p>
            </div>

            {/* Easy Access Card */}
            <div className="snap-center shrink-0 w-[280px] space-y-2">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <h3 className="!text-[24px] !font-[700] !leading-[28.8px] !text-main-dark !font-['Open_Sans']">
                {t('features.access.title')}
              </h3>
              <p className="!text-[14px] !font-[600] !leading-[16.8px] !text-third-gray !font-['Open_Sans']">
                {t('features.access.description')}
              </p>
            </div>

            {/* Tailored Deals Card */}
            <div className="snap-center shrink-0 w-[280px] space-y-2">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <h3 className="!text-[24px] !font-[700] !leading-[28.8px] !text-main-dark !font-['Open_Sans']">
                {t('features.deals.title')}
              </h3>
              <p className="!text-[14px] !font-[600] !leading-[16.8px] !text-third-gray !font-['Open_Sans']">
                {t('features.deals.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Role selection card */}
        <div className="mt-8 sm:mt-16 bg-black rounded-2xl sm:rounded-3xl mx-[-16px] sm:mx-0 p-4 sm:p-8 pt-8 sm:pt-12 text-center min-h-[250px] sm:min-h-[412px] flex items-center justify-center">
          <div className="px-4">
            <h2 className="!text-[#F4F4F4] !text-[28px] sm:!text-[72px] !font-[800] !leading-[40px] sm:!leading-[86.4px] text-center mb-8 !font-['Open_Sans']">
              {t('cta.title.part1')}{' '}
              <br className="hidden sm:block" />
              {t('cta.title.part2')}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-20 justify-center mt-8 sm:mt-16 hidden sm:flex">
              <button className="w-full sm:w-auto px-6 py-3 bg-[#816DF7] hover:opacity-90 transition-colors rounded-full">
                <span className="text-[#FFFFFF] text-[18px] sm:text-[24px] font-[700] leading-[24px] sm:leading-[32px] font-['Open_Sans']">
                  {t('cta.business')}
                </span>
              </button>
              <button className="w-full sm:w-auto px-6 py-3 bg-[#816DF7] hover:opacity-90 transition-colors rounded-full">
                <span className="text-[#FFFFFF] text-[18px] sm:text-[24px] font-[700] leading-[24px] sm:leading-[32px] font-['Open_Sans']">
                  {t('cta.customer')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
  
  