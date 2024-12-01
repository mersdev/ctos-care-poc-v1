import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  Legend,
} from "recharts";
import { fetchJobMarketData, JobMarketData } from "../../api/jobMarketApi";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const JobMarketTrend: React.FC = () => {
  const [jobData, setJobData] = useState<JobMarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [marketSummary, setMarketSummary] = useState({
    totalJobs: 0,
    avgSalary: 0,
    topSkill: "",
    mostActiveRegion: "",
    salaryRange: { min: 0, max: 0 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchJobMarketData();
        setJobData(data);
        calculateMarketSummary(data);
      } catch (error) {
        console.error("Error fetching job market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateMarketSummary = (data: JobMarketData[]) => {
    const totalJobs = data.length;
    const avgSalary =
      data.reduce((acc, job) => acc + parseInt(job.avg_price || "0"), 0) /
      totalJobs;

    // Find top skill
    const skillsMap = new Map<string, number>();
    data.forEach((job) => {
      const tags = Array.isArray(job.tags) ? job.tags : [];
      tags.forEach((tag: string) => {
        const trimmedTag = tag.trim();
        skillsMap.set(trimmedTag, (skillsMap.get(trimmedTag) || 0) + 1);
      });
    });
    const topSkill =
      Array.from(skillsMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "N/A";

    // Find most active region
    const regionMap = new Map<string, number>();
    data.forEach((job) => {
      const state = job.client_state || "Unknown";
      regionMap.set(state, (regionMap.get(state) || 0) + 1);
    });
    const mostActiveRegion =
      Array.from(regionMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Unknown";

    // Calculate salary range
    const salaryRange = {
      min: Math.min(...data.map((job) => parseInt(job.min_price || "0"))),
      max: Math.max(...data.map((job) => parseInt(job.max_price || "0"))),
    };

    setMarketSummary({
      totalJobs,
      avgSalary,
      topSkill,
      mostActiveRegion,
      salaryRange,
    });
  };

  // Process data for visualizations
  const processTagsData = () => {
    const tagsMap = new Map<string, number>();
    jobData.forEach((job) => {
      const tags = Array.isArray(job.tags) ? job.tags : [];
      tags.forEach((tag: string) => {
        const cleanedTag = tag.trim();
        if (cleanedTag) {
          tagsMap.set(cleanedTag, (tagsMap.get(cleanedTag) || 0) + 1);
        }
      });
    });

    return Array.from(tagsMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value / jobData.length) * 100).toFixed(1) + "%",
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  const processPriceRangeData = () => {
    const ranges = [
      { range: "1,500-3,000", min: 1500, max: 3000 },
      { range: "3,001-5,000", min: 3001, max: 5000 },
      { range: "5,001-7,000", min: 5001, max: 7000 },
      { range: "7,001-9,000", min: 7001, max: 9000 },
      { range: "9,001+", min: 9001, max: Infinity },
    ];

    const rangeMap = new Map<string, number>();
    ranges.forEach((r) => rangeMap.set(r.range, 0));

    jobData.forEach((job) => {
      const avgPrice = parseInt(job.avg_price || "0");
      const range = ranges.find((r) => avgPrice >= r.min && avgPrice <= r.max);
      if (range) {
        rangeMap.set(range.range, (rangeMap.get(range.range) || 0) + 1);
      }
    });

    return Array.from(rangeMap.entries())
      .map(([range, value]) => ({
        range,
        value,
        percentage: ((value / jobData.length) * 100).toFixed(1) + "%",
      }))
      .filter((item) => item.value > 0);
  };

  const processGeographicData = () => {
    const stateMap = new Map<string, number>();
    jobData.forEach((job) => {
      const state = job.client_state || "Unknown";
      stateMap.set(state, (stateMap.get(state) || 0) + 1);
    });

    return Array.from(stateMap.entries())
      .map(([state, value]) => ({
        state,
        value,
        percentage: ((value / jobData.length) * 100).toFixed(1) + "%",
      }))
      .sort((a, b) => b.value - a.value);
  };

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`${value} jobs`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Job Market Analysis Summary</CardTitle>
          <CardDescription>
            Overview of current freelance job market trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Jobs Available</p>
              <p className="text-2xl font-bold">{marketSummary.totalJobs}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Average Salary (RM)</p>
              <p className="text-2xl font-bold">
                {marketSummary.avgSalary.toFixed(2)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Most In-Demand Skill</p>
              <p className="text-2xl font-bold">{marketSummary.topSkill}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Most Active Region</p>
              <p className="text-2xl font-bold">
                {marketSummary.mostActiveRegion}
              </p>
            </div>
            <div className="col-span-full">
              <p className="text-sm font-medium">Salary Range</p>
              <p className="text-lg">
                RM {marketSummary.salaryRange.min} - RM{" "}
                {marketSummary.salaryRange.max}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Top 10 In-Demand Skills</CardTitle>
            <CardDescription>
              Most frequently requested skills in job postings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={processTagsData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                    >
                      {processTagsData().map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Skill</TableHead>
                      <TableHead className="text-right">Job Count</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processTagsData().map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.value}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.percentage}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Salary Distribution</CardTitle>
            <CardDescription>
              Distribution of jobs across salary ranges (RM)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={processPriceRangeData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Number of Jobs" fill="#8884d8">
                      {processPriceRangeData().map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Price Range</TableHead>
                    <TableHead className="text-right">Job Count</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processPriceRangeData().map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.range}
                      </TableCell>
                      <TableCell className="text-right">{item.value}</TableCell>
                      <TableCell className="text-right">
                        {item.percentage}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>
              Job distribution across Malaysian regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={processGeographicData()}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="state" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Number of Jobs" fill="#8884d8">
                      {processGeographicData().map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Job Count</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processGeographicData().map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.state}
                      </TableCell>
                      <TableCell className="text-right">{item.value}</TableCell>
                      <TableCell className="text-right">
                        {item.percentage}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobMarketTrend;
