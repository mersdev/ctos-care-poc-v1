import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import {
  DashboardService,
  DashboardData,
} from "../../services/dashboardService";
import { useToast } from "@/components/ui/use-toast";
import TodoListDash from "../Todo/TodoListDash";
import {
  IconFileAnalytics,
  IconBuildingBank,
  IconPigMoney,
  IconStars,
  IconTargetArrow,
  IconCalendarMonth,
  IconCreditCardPay,
  IconChartBar,
  IconMessageChatbot,
} from "@tabler/icons-react";
import html2canvas from "html2canvas";
// import Tracker from "../Tracker";

const recommendations = [
  { seq: 1, code: "net_worth", desc: "Net Worth" },
  { seq: 2, code: "budgeting", desc: "Budgeting" },
  { seq: 3, code: "debt_mgmt", desc: "Debt Management" },
  { seq: 4, code: "insurance", desc: "Insurance Coverage" },
  { seq: 5, code: "long_term", desc: "Long Term Goals" },
  { seq: 6, code: "income_stability", desc: "Income Stability" },
  { seq: 7, code: "emergency_fund", desc: "Emergency Fund" },
  { seq: 8, code: "retirement", desc: "Retirement Savings" },
  { seq: 9, code: "financial_lit", desc: "Financial Literacy" },
  { seq: 10, code: "behavior", desc: "Behavioral Aspects" },
];

const loanData = [
  {
    avatar: "V",
    title: "Visa Platinum",
    amount: "$1,200.00",
    monthlyPayment: "$100.00",
    monthsLeft: "12 months left",
  },
  {
    avatar: "M",
    title: "Mastercard Gold",
    amount: "$5,500.00",
    monthlyPayment: "$458.33",
    monthsLeft: "12 months left",
  },
  {
    avatar: "A",
    title: "AMEX Rewards",
    amount: "$3,250.00",
    monthlyPayment: "$270.83",
    monthsLeft: "12 months left",
  },
];

const CentralizedFinancialDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await DashboardService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Error loading dashboard</h1>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }
  const leftColumn = recommendations.slice(
    0,
    Math.ceil(recommendations.length / 2)
  );
  const rightColumn = recommendations.slice(
    Math.ceil(recommendations.length / 2)
  );

  const cardData = [
    {
      id: 1,
      icon: <IconBuildingBank size={32} className="mb-4 text-violet-700" />,
      title: "Total Balance",
      value: `$${dashboardData.totalBalance.toLocaleString()}`,
      percentage: 20.1,
    },
    // {
    //   id: 2,
    //   icon: <IconBasketDollar size={32} className="mb-4 text-sky-500" />,
    //   title: "Total Spending",
    //   value: `$${dashboardData.totalSavings.toLocaleString()}`,
    //   percentage: 8.2,
    // },
    {
      id: 3,
      icon: <IconPigMoney size={32} className="mb-4 text-green-700" />,
      title: "Total Savings",
      value: `$${dashboardData.totalSpending.toLocaleString()}`,
      percentage: 4.5,
    },
    {
      id: 4,
      icon: <IconStars size={32} className="mb-4 text-yellow-500" />,
      title: "Credit Score",
      value: dashboardData.creditScore,
      percentage: null, // No percentage for Credit Score
      status: "Good",
    },
  ];

  // const trackerData = {
  //   fullData: 2500,
  //   currentData: 1989,
  //   breakdown: [
  //     { name: "food", amount: 256, unit: "g" },
  //     { name: "car", amount: 152, unit: "g" },
  //     { name: "entertain", amount: 115, unit: "g" },
  //   ],
  // };

  const handleDownloadButtonClick = () => {
    const element = document.getElementById("downloadable-area");

    if (element) {
      html2canvas(element, {
        onclone: (clonedDoc: any) => {
          const clonedElement = clonedDoc.getElementById("downloadable-area");
          if (clonedElement) {
            clonedElement.style.padding = "1rem";
            const buttons = clonedElement.querySelectorAll("button");
            buttons.forEach((btn: any) => (btn.style.display = "none"));
          }
        },
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = "report.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-3xl font-bold mb-6">
        Centralized Financial Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-10 gap-5">
        <div className="col-span-10 md:col-span-6" id="downloadable-area">
          <div className="grid gap-5  lg:grid-cols-3 mb-6">
            {cardData.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6 flex-col">
                  {item.icon}
                  <p className="text-md text-muted-foreground">{item.title}</p>
                  <div className="text-2xl font-bold">{item.value}</div>
                  {item.percentage !== null ? (
                    <p
                      className={`text-xs ${
                        item.percentage > 0
                          ? "text-green-500"
                          : item.percentage < 0
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {item.percentage > 0 ? "+" : ""}
                      {item.percentage}% from last month
                    </p>
                  ) : (
                    <p className="text-xs text-green-500">{item.status}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-start md:items-center  justify-start">
                  <IconCalendarMonth className="flex-shrink-0" />
                  <span className="leading-none"> Monthly Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={dashboardData.monthlyData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#0ea5e9" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="mt-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-start md:items-center justify-start">
                  <IconCreditCardPay className="flex-shrink-0" />
                  <span className="leading-none">Outstanding Loan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="md:divide-y md:divide-gray-300">
                  {loanData.map((loan, index) => (
                    <div
                      key={index}
                      className="flex md:items-center items-start md:flex-row flex-col justify-between py-2"
                    >
                      <div className="flex items-center justify-center ml-0 md:ml-4 w-8 h-8 rounded-md bg-black text-white text-lg font-bold">
                        {loan.avatar}
                      </div>
                      <div className="flex md:ml-4 ml-0 items-start md:items-center w-full md:gap-2 flex-col md:flex-row justify-between py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {loan.title} - {loan.amount}
                          </p>
                          <p className="text-sm text-gray-500">
                            Monthly Payment: {loan.monthlyPayment}
                          </p>
                        </div>

                        <div className="text-sm text-gray-500">
                          {loan.monthsLeft}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="col-span-10 md:col-span-4">
          <div className="w-full">
            <div className="w-full flex justify-end">
              <button
                onClick={handleDownloadButtonClick}
                // onClick={() => navigate("/todo-list")}
                className="flex items-center text-sm hover-focus-effect"
              >
                DOWNLOAD FULL REPORT <IconFileAnalytics />
              </button>
            </div>
            <div className="bg-[#1a1a1a] mt-1 rounded-xl shadow-md p-4 mb-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold flex gap-2 text-white items-start md:items-center justify-start">
                  <IconTargetArrow className="flex-shrink-0" />
                  <span className="leading-none"> Goal Status</span>
                </h3>
              </div>
              <p className="text-gray-400 text-sm mb-5">In progress</p>
              <div className="relative w-full h-2 bg-gray-800 rounded-full">
                <div
                  className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
              <p className="text-gray-400 text-xs mt-2">
                Estimate goal process 20-30 days
              </p>
              <button className="w-full mt-5 py-2 text-sm font-bold text-black bg-gray-300 rounded-lg hover:bg-gray-400 transition">
                VIEW STATUS
              </button>
            </div>
          </div>
          <TodoListDash />
          <div className="bg-black text-white rounded-lg shadow-lg p-6 mb-6 mt-5">
            <h3 className="text-lg font-bold flex gap-2 items-start md:items-center justify-start">
              <IconMessageChatbot className="flex-shrink-0" />
              <span className="leading-none">AI-Powered Recommendations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5 mt-5">
              <ul className="list-disc list-inside space-y-2">
                {leftColumn.map((item: any) => (
                  <li key={item.code} className="text-sm">
                    {item.desc}
                  </li>
                ))}
              </ul>
              <ul className="list-disc list-inside space-y-2">
                {rightColumn.map((item: any) => (
                  <li key={item.code} className="text-sm">
                    {item.desc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 items-start md:items-center  justify-start">
                <IconChartBar className="flex-shrink-0" />
                <span className="leading-none"> Spending by Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dashboardData.spendingData} barCategoryGap={12}>
                  <XAxis dataKey="category" tick={{ fill: "white" }} />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="amount"
                    // barSize={50}
                  >
                    {dashboardData.spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className=" p-4">
                {dashboardData.spendingData.map((item, index) => (
                  <div key={item.category}>
                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="text-xs text-gray-700">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        {item.amount}
                      </span>
                    </div>
                    {index !== dashboardData.spendingData.length - 1 && (
                      <hr className="border-t border-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* <Tracker data={trackerData} /> */}
        </div>
      </div>
    </div>
  );
};

export default CentralizedFinancialDashboard;
