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

interface BusinessInterest {
  name: string
  status: string
  natureOfBusiness: string
  incorporationDate: string
  ccmDate: string
  position: string
  appointedDate: string
  address: string
  paidUpShares: string
}

interface DirectorshipsBusinessInterestsProps {
  interests?: BusinessInterest[]
}

const DirectorshipsBusinessInterests: React.FC<DirectorshipsBusinessInterestsProps> = ({ 
  interests = [] 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Directorships & Business Interests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Company Name</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Position</TableHeaderCell>
              <TableHeaderCell>Nature of Business</TableHeaderCell>
              <TableHeaderCell>Appointed Date</TableHeaderCell>
              <TableHeaderCell>Paid Up Shares</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interests.map((interest, index) => (
              <TableRow key={index}>
                <TableCell>{interest.name}</TableCell>
                <TableCell>{interest.status}</TableCell>
                <TableCell>{interest.position}</TableCell>
                <TableCell>{interest.natureOfBusiness}</TableCell>
                <TableCell>{interest.appointedDate}</TableCell>
                <TableCell>{interest.paidUpShares}</TableCell>
              </TableRow>
            ))}
            {interests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No business interests found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default DirectorshipsBusinessInterests
