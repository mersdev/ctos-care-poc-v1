import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Address {
  address: string
  dateReported: string
  source: string
}

interface AddressRecordsProps {
  addresses?: Address[]
}

const AddressRecords: React.FC<AddressRecordsProps> = ({ addresses = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Date Reported</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.address}</TableCell>
                <TableCell>{record.dateReported}</TableCell>
                <TableCell>{record.source}</TableCell>
              </TableRow>
            ))}
            {addresses.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No address records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default AddressRecords
