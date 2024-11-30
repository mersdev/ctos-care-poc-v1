import React from "react";
import { PieChart, Pie, Cell } from "recharts";

type trackerDataBreakdown = {
  name: string;
  amount: number;
  unit: string;
};

type trackerData = {
  fullData: number;
  currentData: number;
  breakdown: trackerDataBreakdown[];
};

const Tracker = ({ data }: { data: trackerData }) => {
  const percentage = (data.currentData / data.fullData) * 100;

  // PieChart data
  const pieData = [
    { name: "Consumed", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white shadow-md rounded-lg p-6 max-w-4xl">
      {/* Left Column */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-black">⚡</span> Your Data
          </h2>
          <p className="text-gray-500 text-sm">Sedentary lifestyle</p>
        </div>
        {data.breakdown.map((item, index) => (
          <div key={index} className="flex items-center text-gray-700 gap-2">
            <span className="font-bold text-black">
              {item.amount + item.unit}
            </span>
            <span className="capitalize">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="relative flex flex-col items-center justify-center">
        <PieChart width={200} height={200}>
          <Pie
            data={pieData}
            startAngle={180} // Start at 180 degrees
            endAngle={0} // End at 0 degrees
            innerRadius={70}
            outerRadius={100}
            dataKey="value"
          >
            <Cell key="Consumed" fill="#ef4444" /> {/* Red */}
            <Cell key="Remaining" fill="#d1d5db" /> {/* Grey */}
          </Pie>
        </PieChart>
        <div className="absolute text-center">
          <p className="text-2xl font-bold">{data.currentData} kcal</p>
          <p className="text-sm text-gray-500">out of {data.fullData} kcal</p>
        </div>
      </div>
    </div>
  );
};

export default Tracker;
