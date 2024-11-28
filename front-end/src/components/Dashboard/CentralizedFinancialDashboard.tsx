import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Jan", total: 1000 },
  { name: "Feb", total: 1200 },
  { name: "Mar", total: 900 },
  { name: "Apr", total: 1500 },
  { name: "May", total: 1800 },
  { name: "Jun", total: 2000 },
]

const spendingData = [
  { category: "Housing", amount: 1000 },
  { category: "Food", amount: 500 },
  { category: "Transportation", amount: 300 },
  { category: "Utilities", amount: 200 },
  { category: "Entertainment", amount: 150 },
]

const CentralizedFinancialDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Centralized Financial Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <div className="text-2xl font-bold">$5,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <div className="text-2xl font-bold">$3,352.40</div>
            <p className="text-xs text-muted-foreground">+4.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <div className="text-2xl font-bold">$1,879.49</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
            <div className="text-2xl font-bold">742</div>
            <p className="text-xs text-muted-foreground">+12 points from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={spendingData}>
                <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CentralizedFinancialDashboard
