import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CTOSScoreData {
  score?: number
  factors?: string[]
}

interface CTOSScoreProps {
  data?: CTOSScoreData
}

const CTOSScore: React.FC<CTOSScoreProps> = ({ data = {} }) => {
  const { score = 0, factors = [] } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle>CTOS Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium mb-2">Your Score</p>
          <div className="flex items-center gap-4">
            <p className="text-4xl font-bold">{score}</p>
            <div className="text-sm">
              <p className="font-medium">Score Range</p>
              <p>300-850</p>
            </div>
          </div>
        </div>

        {factors.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Key Factors Affecting Your Score</p>
            <ul className="list-disc pl-5 space-y-1">
              {factors.map((factor, index) => (
                <li key={index} className="text-sm">{factor}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CTOSScore
