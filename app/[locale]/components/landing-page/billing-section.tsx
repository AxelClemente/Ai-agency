import { Download } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function BillingSection() {
  const t = useTranslations('BusinessDashboard.billing')

  return (
    <div className="w-full">
     
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tariff Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 w-full lg:w-[400px] h-fit">
          <h3 className="text-lg font-semibold mb-1 text-center">{t('unlimitedTariff')}</h3>
          <div className="text-lg font-semibold mb-4 text-center">{t('pricePerYear')}</div>
          <p className="text-sm text-gray-500 mb-6 text-center">
            {t('validUntil', { date: '20.10.2025' })}
          </p>
          <p className="text-sm text-gray-600 mb-8">{t('description')}</p>
          <div className="space-y-3">
            <button className="w-[329px] h-[78px] bg-black text-white rounded-full py-2 px-4 text-sm hover:bg-gray-800 transition-colors">
              {t('downloadContract')}
            </button>
            <button className="w-[329px] h-[78px] bg-black text-white rounded-full py-2 px-4 text-sm hover:bg-gray-800 transition-colors">
              {t('extendContract')}
            </button>
            <button className="w-[329px] h-[78px] bg-black text-white rounded-full py-2 px-4 text-sm hover:bg-gray-800 transition-colors">
              {t('changeTariff')}
            </button>
          </div>
        </div>

        {/* Billing History Table - Hidden on mobile */}
        <div className="hidden md:flex flex-1 overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-semibold">{t('date')}</th>
                <th className="text-left py-4 px-4 font-semibold">{t('tariff')}</th>
                <th className="text-left py-4 px-4 font-semibold">{t('price')}</th>
                <th className="text-left py-4 px-4 font-semibold">{t('state')}</th>
                <th className="py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {[2025, 2024, 2023, 2022].map((year) => (
                <tr key={year} className="border-b">
                  <td className="py-4 px-4">20.10.{year}</td>
                  <td className="py-4 px-4">{t('unlimitedTariff')}</td>
                  <td className="py-4 px-4">{t('pricePerYear')}</td>
                  <td className="py-4 px-4">{t('success')}</td>
                  <td className="py-4 px-4">
                    <button className="hover:bg-gray-100 p-2 rounded-full">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Transactions Button */}
        <div className="md:hidden w-full bg-white rounded-lg border border-gray-200 p-6">
          <button className="w-full h-[78px] bg-[#000000] text-white rounded-full py-2 px-4 text-sm hover:bg-opacity-90 transition-colors">
            {t('seeTransactions')}
          </button>
        </div>
      </div>
    </div>
  )
}