import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CreditInfoAtAGlanceProps {
  data?: {
    creditScore?: number
    creditUtilization?: number
    totalAccounts?: number
    totalDebt?: number
    paymentHistory?: number
    creditMix?: number
  }
}

const CreditInfoAtAGlance: React.FC<CreditInfoAtAGlanceProps> = ({ data = {} }) => {
  const {
    creditScore = 0,
    creditUtilization = 0,
    totalAccounts = 0,
    totalDebt = 0,
    paymentHistory = 0,
    creditMix = 0
  } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Information At A Glance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Credit Score</p>
            <p className="text-2xl font-bold">{creditScore}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Credit Utilization</p>
            <p className="text-2xl font-bold">{creditUtilization}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Total Accounts</p>
            <p className="text-2xl font-bold">{totalAccounts}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Total Debt</p>
            <p className="text-2xl font-bold">RM {totalDebt.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Payment History</p>
            <p className="text-2xl font-bold">{paymentHistory}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Credit Mix</p>
            <p className="text-2xl font-bold">{creditMix}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CreditInfoAtAGlance
