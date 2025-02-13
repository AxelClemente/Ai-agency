'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQSection() {
  const t = useTranslations('FAQ');
  const testimonials = useTranslations('Testimonials');

  return (
    <>
      <section className="w-full py-10 sm:py-20 mt-[-100px] sm:mt-0">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          {/* Left side - placeholder image */}
          <div className="w-[calc(100%+32px)] -mx-[16px] sm:mx-0 sm:w-[523px] h-[400px] sm:h-[829px] bg-main-gray rounded-[20px] sm:rounded-[32px]"></div>

          {/* Right side - FAQ content */}
          <div className="w-full px-4 sm:px-0 sm:w-[523px] space-y-6 sm:space-y-8">
            <h2 className="!text-[28px] sm:!text-[64px] !font-[800] !leading-[43.2px] sm:!leading-[76.8px] !tracking-tight !text-main-dark !font-['Open_Sans']">
              {t('title')}
            </h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="!text-[24px] sm:!text-[40px] !font-[700] !leading-[32px] sm:!leading-[54px] !text-main-dark !font-['Open_Sans'] text-left">
                  {t('question1')}
                </AccordionTrigger>
                <AccordionContent className="!text-[16px] sm:!text-[20px] !font-[500] !leading-[24px] sm:!leading-[32px] !text-third-gray !font-['Poppins']">
                  {t('answer1')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="!text-[24px] sm:!text-[40px] !font-[700] !leading-[32px] sm:!leading-[54px] !text-main-dark !font-['Open_Sans'] text-left">
                  {t('question2')}
                </AccordionTrigger>
                <AccordionContent className="!text-[16px] sm:!text-[20px] !font-[500] !leading-[24px] sm:!leading-[32px] !text-third-gray !font-['Poppins']">
                  {t('answer2')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="!text-[24px] sm:!text-[40px] !font-[700] !leading-[32px] sm:!leading-[54px] !text-main-dark !font-['Open_Sans'] text-left">
                  {t('question3')}
                </AccordionTrigger>
                <AccordionContent className="!text-[16px] sm:!text-[20px] !font-[500] !leading-[24px] sm:!leading-[32px] !text-third-gray !font-['Poppins']">
                  {t('answer3')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-0">
          <div className="pt-6 sm:pt-8 space-y-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="!text-[48px] sm:!text-[128px] !font-[500] !leading-[76.8px] sm:!leading-[204.8px] !font-['Poppins'] text-center">
                &ldquo;
              </div>
              <div>
                <div className="!text-[16px] sm:!text-[24px] !font-[700] !leading-[24px] sm:!leading-[32px] !text-main-dark !font-['Open_Sans'] text-center">
                  {testimonials('name')}
                </div>
                <div className="!text-[14px] sm:!text-[18px] !font-[400] !leading-[20px] sm:!leading-[24px] !text-third-gray !font-['Open_Sans']">
                  {testimonials('role')}
                </div>
              </div>
            </div>
            <div className="relative">
              <blockquote className="!text-[20px] sm:!text-[40px] !font-[700] !leading-[28px] sm:!leading-[54px] !text-main-dark !font-['Open_Sans'] ml-4 sm:ml-20">
                {testimonials('quote')}
              </blockquote>
              {/* Avatar placeholder */}
              <div className="absolute -top-24 sm:-top-4 right-2 sm:right-10 w-16 sm:w-40 h-16 sm:h-40 bg-main-gray rounded-full"></div>
            </div>
            <div className="flex justify-end gap-4 sm:gap-10 mr-2 sm:mr-16">
              <button className="w-[24px] sm:w-[36.8px] h-[24px] sm:h-[36.8px] flex items-center justify-center rounded-full border-[1.5px] sm:border-[3px] border-third-gray text-third-gray hover:bg-gray-50">
                <ChevronLeft className="w-2.5 sm:w-4 h-2.5 sm:h-4" strokeWidth={4} />
              </button>
              <button className="w-[24px] sm:w-[36.8px] h-[24px] sm:h-[36.8px] flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-900">
                <ChevronRight className="w-2.5 sm:w-4 h-2.5 sm:h-4" strokeWidth={4} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-0">
          <div className="mt-8 sm:mt-16 bg-black rounded-2xl sm:rounded-3xl mx-[-16px] sm:mx-0 p-4 sm:p-8 pt-8 sm:pt-12 text-center min-h-[250px] sm:min-h-[412px] flex items-center justify-center">
            <div className="px-4">
              <h2 className="!text-[#F4F4F4] !text-[28px] sm:!text-[72px] !font-[800] !leading-[40px] sm:!leading-[86.4px] text-center mb-8 !font-['Open_Sans']">
                {t('cta.title')}
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
    </>
  )
}

