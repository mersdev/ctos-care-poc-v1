import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CTOSLitigationIndexProps {
  data?: {
    index?: number
    description?: string
  }
}

const CTOSLitigationIndex: React.FC<CTOSLitigationIndexProps> = ({ data = {} }) => {
  const { index = 0, description = 'No litigation records found' } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle>CTOS Litigation Index</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Index Score</p>
          <p className="text-2xl font-bold">{index}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Description</p>
          <p className="text-base">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default CTOSLitigationIndex
