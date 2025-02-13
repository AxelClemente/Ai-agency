'use client'

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from 'next-intl'

interface ShareAppModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ShareAppModal({ isOpen, onClose }: ShareAppModalProps) {
  const t = useTranslations('BusinessDashboard.share')
  const shareUrl = "http://fideliza.com" // Reemplazar con la URL real
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch (err) {
      console.error(t('copyError'), err)
    }
  }

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[706px] p-0 overflow-hidden !fixed !left-0 !right-0 !bottom-0 !top-0 !translate-x-0 !translate-y-0 !rounded-none !h-screen md:!left-auto md:!right-[calc((100vw-1440px)/2)]">
        <div className="p-4 md:p-8">
          <DialogTitle className="!text-[30px] md:!text-[30px] !font-['Open_Sans'] !font-[700] !leading-[36px] md:!leading-[36px] mb-4 md:mb-8 text-center md:text-left mt-8 md:mt-0">
            {t('title')}
          </DialogTitle>
          
          <p className="text-[24px] md:text-[24px] font-['Open_Sans'] font-[700] leading-[32px] md:leading-[32px] text-justify pb-8 md:pb-36 mt-16 md:mt-0">
            {t('description')}
          </p>

          <div className="flex flex-col md:flex-row items-center relative mt-4 md:mt-8 gap-4 md:gap-0">
            <div className="relative flex items-center w-[360px] md:w-[558px] mx-auto md:mx-0">
              <img 
                src="/share.svg" 
                alt="Share icon" 
                className="absolute left-6 z-10"
              />
              <Input
                value={shareUrl}
                readOnly
                className="w-full h-[78px] md:h-[74px] rounded-[100px] bg-[#F6F6F6] border-0 pl-20 pr-6 text-base md:text-lg text-gray-500"
              />
            </div>
            <Button
              onClick={handleCopyLink}
              className="w-[360px] h-[78px] rounded-[100px] bg-[#000000] text-white mx-auto md:w-[192px] md:mx-0 md:absolute md:right-0 md:z-10"
            >
              <span className="font-['Open_Sans'] font-[600] text-[16px] md:text-[18px] leading-[20px] md:leading-[22px] text-center">
                {t('copyLink')}
              </span>
            </Button>
          </div>

          <div className="flex justify-center gap-6 pt-4 mt-8 md:mt-10">
            <button onClick={handleShareFacebook} className="p-2">
              <img 
                src="/facebook1.svg" 
                alt={t('facebookAlt')}
                width={40}
                height={40}
                className="md:w-[48px] md:h-[48px]"
              />
            </button>
            <button onClick={handleShareTwitter} className="p-2">
              <img 
                src="/twitter.svg" 
                alt={t('twitterAlt')}
                width={40}
                height={40}
                className="md:w-[48px] md:h-[48px]"
              />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}