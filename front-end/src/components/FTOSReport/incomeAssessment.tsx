import { Bar, BarChart, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface IncomeData {
  month: string;
  income: number;
}

interface ClientData {
  name: string;
  rating: number;
  projects: number;
}

interface IncomeMetrics {
  monthly_average: number;
  stability_score: number;
  growth_rate: number;
  sources: { [key: string]: number };
}

interface IncomeAssessmentProps {
  metrics?: IncomeMetrics;
}

const incomeData: IncomeData[] = [
  { month: "Jan", income: 5000 },
  { month: "Feb", income: 5200 },
  { month: "Mar", income: 4800 },
  { month: "Apr", income: 5100 },
  { month: "May", income: 5300 },
  { month: "Jun", income: 5400 },
]

const clientData: ClientData[] = [
  { name: "Client A", rating: 4.5, projects: 3 },
  { name: "Client B", rating: 4.8, projects: 2 },
  { name: "Client C", rating: 4.2, projects: 1 },
  { name: "Client D", rating: 4.7, projects: 2 },
]

export default function IncomeAssessment({ metrics }: IncomeAssessmentProps) {
  if (!metrics) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Income Overview</CardTitle>
            <CardDescription>Your income trends and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold">Average Monthly Income</h3>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Stability Score</h3>
                <p className="text-2xl font-bold">0.00</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Growth Rate</h3>
                <p className="text-2xl font-bold">0%</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Income Sources</h3>
                <p className="text-2xl font-bold">0 Sources</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { monthly_average, stability_score, growth_rate, sources } = metrics;
  const sourceData = Object.entries(sources).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Income Overview</CardTitle>
          <CardDescription>Your income trends and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">Average Monthly Income</h3>
              <p className="text-2xl font-bold">${monthly_average.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Stability Score</h3>
              <p className="text-2xl font-bold">{stability_score.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Growth Rate</h3>
              <p className="text-2xl font-bold">{(growth_rate * 100).toFixed(1)}%</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Income Sources</h3>
              <p className="text-2xl font-bold">{Object.keys(sources).length} Sources</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income Sources Distribution</CardTitle>
          <CardDescription>Breakdown of your income sources</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sourceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Income Trend</CardTitle>
          <CardDescription>
            Analysis of monthly income patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={incomeData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Client Ratings and Projects</CardTitle>
          <CardDescription>
            Breakdown of client ratings and projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={clientData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rating" fill="#0ea5e9" />
              <Bar dataKey="projects" fill="#34C759" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Industry and Platform Reliance</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your income is primarily derived from the technology sector ({Object.keys(sources).length}%) with a focus on web development. You mainly use platforms like Upwork ({sources['Upwork'] ? (sources['Upwork'] / monthly_average * 100).toFixed(2) : 0}%) and Freelancer ({sources['Freelancer'] ? (sources['Freelancer'] / monthly_average * 100).toFixed(2) : 0}%) for client acquisition.</p>
        </CardContent>
      </Card>
    </div>
  );
}
