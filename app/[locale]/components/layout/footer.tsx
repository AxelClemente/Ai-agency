export const Footer = () => {
  return (
    <footer className="w-full py-4 sm:py-6 border-t border-b border-gray-200 mb-4 sm:mb-8">
      <div className="container mx-auto px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="flex items-center gap-6 sm:gap-2 text-center sm:text-left">
            <img src="/logofideliza.svg" alt="Logo" className="w-8 sm:w-10 h-8 sm:h-10" />
            <span className="!text-[14px] sm:!text-[16px] !font-[500] !leading-[22.4px] sm:!leading-[25.6px] !text-third-gray !font-['Poppins']">
              ©Namebrand - All Rights Reserved 2024
            </span>
          </div>
          
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="!text-[14px] sm:!text-[16px] !font-[500] !leading-[22.4px] sm:!leading-[25.6px] !text-third-gray !font-['Poppins'] hover:text-gray-900">
              Terms of conditions
            </a>
            <a href="#" className="!text-[14px] sm:!text-[16px] !font-[500] !leading-[22.4px] sm:!leading-[25.6px] !text-third-gray !font-['Poppins'] hover:text-gray-900">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}