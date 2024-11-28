import React from 'react'
import { useTranslation } from 'react-i18next'

interface TradeReferee {
  companyName: string
  dateSubmitted: string
  creditLimit: number
  outstandingAmount: number
  paymentBehavior: string
}

interface TradeRefereeListingProps {
  data: TradeReferee[]
}

const TradeRefereeListing: React.FC<TradeRefereeListingProps> = ({ data }) => {
  const { t } = useTranslation()
  
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">{t("Trade Referee Listing")}</h2>
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">{t("Company Name")}</th>
                <th className="text-left">{t("Date Submitted")}</th>
                <th className="text-left">{t("Credit Limit")} (RM)</th>
                <th className="text-left">{t("Outstanding Amount")} (RM)</th>
                <th className="text-left">{t("Payment Behavior")}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((referee, index) => (
                <tr key={index}>
                  <td>{referee.companyName}</td>
                  <td>{referee.dateSubmitted}</td>
                  <td>{referee.creditLimit.toLocaleString()}</td>
                  <td>{referee.outstandingAmount.toLocaleString()}</td>
                  <td>{t(referee.paymentBehavior)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>{t("No trade referee listings available.")}</p>
      )}
    </section>
  )
}

export default TradeRefereeListing
