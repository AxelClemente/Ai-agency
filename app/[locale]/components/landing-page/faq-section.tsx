import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import { useTranslations } from 'next-intl'
  
  export default function FAQSection() {
    const t = useTranslations('BusinessDashboard.faq')

    return (
      <div className="w-full">
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border border-gray-100 rounded-xl shadow-sm">
            <AccordionTrigger className="text-[20px] sm:text-[30px] font-bold font-['Open_Sans'] leading-[26px] sm:leading-[36px] py-[16px] sm:py-[20px] text-left px-4">
              {t('howItWorks')}
            </AccordionTrigger>
            <AccordionContent className="!px-4 !text-[20px] !font-semibold !font-['Open_Sans'] !leading-[26px] !paragraph-[20px]">
              {t('howItWorksAnswer')}
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-2" className="border border-gray-100 rounded-xl shadow-sm">
            <AccordionTrigger className="text-[20px] sm:text-[30px] font-bold font-['Open_Sans'] leading-[26px] sm:leading-[36px] py-[16px] sm:py-[20px] text-left px-4">
              {t('whichStores')}
            </AccordionTrigger>
            <AccordionContent className="!px-4 !text-[20px] !font-semibold !font-['Open_Sans'] !leading-[26px] !paragraph-[20px]">
              {t('whichStoresAnswer')}
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-3" className="border border-gray-100 rounded-xl shadow-sm">
            <AccordionTrigger className="text-[20px] sm:text-[30px] font-bold font-['Open_Sans'] leading-[26px] sm:leading-[36px] py-[16px] sm:py-[20px] text-left px-4">
              {t('subscriptionPlans')}
            </AccordionTrigger>
            <AccordionContent className="!px-4 !text-[20px] !font-semibold !font-['Open_Sans'] !leading-[26px] !paragraph-[20px]">
              {t('subscriptionPlansAnswer')}
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-4" className="border border-gray-100 rounded-xl shadow-sm">
            <AccordionTrigger className="text-[20px] sm:text-[30px] font-bold font-['Open_Sans'] leading-[26px] sm:leading-[36px] py-[16px] sm:py-[20px] text-left px-4">
              {t('howToSubscribe')}
            </AccordionTrigger>
            <AccordionContent className="!px-4 !text-[20px] !font-semibold !font-['Open_Sans'] !leading-[26px] !paragraph-[20px]">
              {t('howToSubscribeAnswer')}
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-5" className="border border-gray-100 rounded-xl shadow-sm">
            <AccordionTrigger className="text-[20px] sm:text-[30px] font-bold font-['Open_Sans'] leading-[26px] sm:leading-[36px] py-[16px] sm:py-[20px] text-left px-4">
              {t('howToCancel')}
            </AccordionTrigger>
            <AccordionContent className="!px-4 !text-[20px] !font-semibold !font-['Open_Sans'] !leading-[26px] !paragraph-[20px]">
              {t('howToCancelAnswer')}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  }
  
  