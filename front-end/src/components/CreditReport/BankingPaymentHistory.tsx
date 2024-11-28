import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead as TableHeaderCell,
} from "@/components/ui/table"

interface BankAccount {
  bank: string
  accountType: string
  status: string
  paymentHistory: string
}

interface BankingPaymentHistoryProps {
  accounts?: BankAccount[]
}

const BankingPaymentHistory: React.FC<BankingPaymentHistoryProps> = ({ accounts = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Banking Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Bank</TableHeaderCell>
              <TableHeaderCell>Account Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Payment History</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account, index) => (
              <TableRow key={index}>
                <TableCell>{account.bank}</TableCell>
                <TableCell>{account.accountType}</TableCell>
                <TableCell>{account.status}</TableCell>
                <TableCell>{account.paymentHistory}</TableCell>
              </TableRow>
            ))}
            {accounts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No banking history found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default BankingPaymentHistory
