import React, { useState } from "react";
import {
  IconInfoCircle,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface Fee {
  type: string;
  description: string;
  value: string;
}

interface Requirement {
  description: string;
}

interface CardData {
  id: number;
  title: string;
  minIncome: string;
  interestRate: string;
  annualFee: string;
  rewardRate: string;
  flashDeal: string;
  featured: boolean;
  buttonLabel: string;
  imageUrl: string;
  fees: Fee[];
  requirements: Requirement[];
}

const cardData: CardData[] = [
  {
    id: 1,
    title: "Alliance Bank Visa Virtual Credit Card",
    minIncome: "RM 2,000/month",
    interestRate: "15%",
    annualFee: "RM 0",
    rewardRate: "8 points per RM1 spent",
    flashDeal: "RM3,000 Travel Vouchers & URBANlite Verge Bag",
    featured: true,
    buttonLabel: "Apply Now",
    imageUrl: "/path/to/image1.jpg",
    fees: [
      {
        type: "Annual Fee",
        description: "Free for life",
        value: "0",
      },
      {
        type: "Interest Rate",
        description: "Settling minimum payment due for 12 consecutive months",
        value: "15%",
      },
      {
        type: "Late Payment Fee",
        description:
          "1% of the outstanding balance or RM10, whichever is higher",
        value: "10",
      },
    ],
    requirements: [
      { description: "Minimum Age: 21 years old" },
      { description: "Minimum Annual Income: RM 24,000" },
      { description: "Supplementary Cardholder Age: 18 years old" },
    ],
  },
  {
    id: 2,
    title: "Alliance Bank Visa Platinum Credit Card",
    minIncome: "RM 2,000/month",
    interestRate: "15%",
    annualFee: "RM 120",
    rewardRate: "8 points per RM1 spent",
    flashDeal: "RM3,000 Travel Vouchers",
    featured: true,
    buttonLabel: "Apply Now",
    imageUrl: "/path/to/image2.jpg",
    fees: [
      {
        type: "Annual Fee",
        description: "RM 120/year",
        value: "120",
      },
      {
        type: "Interest Rate",
        description: "Settling minimum payment due for 12 consecutive months",
        value: "15%",
      },
      {
        type: "Late Payment Fee",
        description:
          "2% of the outstanding balance or RM20, whichever is higher",
        value: "20",
      },
    ],
    requirements: [
      { description: "Minimum Age: 22 years old" },
      { description: "Minimum Annual Income: RM 30,000" },
      { description: "Supplementary Cardholder Age: 18 years old" },
    ],
  },
  {
    id: 3,
    title: "RHB Shell Visa Credit Card",
    minIncome: "RM 2,000/month",
    interestRate: "15%",
    annualFee: "RM 195",
    rewardRate: "5% cashback everyday, 12% cashback on specific categories",
    flashDeal: "RM5,000 or RM400 Touch 'n Go eWallet Credits",
    featured: true,
    buttonLabel: "Apply Now",
    imageUrl: "/path/to/image3.jpg",
    fees: [
      {
        type: "Annual Fee",
        description: "RM 195/year",
        value: "195",
      },
      {
        type: "Interest Rate",
        description: "Settling minimum payment due for 12 consecutive months",
        value: "15%",
      },
      {
        type: "Late Payment Fee",
        description:
          "3% of the outstanding balance or RM30, whichever is higher",
        value: "30",
      },
      {
        type: "Cash Advance Fee",
        description: "RM 70 or 7% of the amount withdrawn, whichever is higher",
        value: "70",
      },
    ],
    requirements: [
      { description: "Minimum Age: 21 years old" },
      { description: "Minimum Annual Income: RM 24,000" },
      { description: "Supplementary Cardholder Age: 18 years old" },
    ],
  },
];

const filters = [
  "AEON Credit Service",
  "Affin Bank",
  "Alliance Bank",
  "Ambank",
];

const Promo: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, string>>(
    {}
  );

  const toggleDropdown = (id: number, section: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: prev[id] === section ? "" : section,
    }));
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <h3 className="font-bold text-lg mb-4">Filter by</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Annual Income</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Annual Income
                </option>
                <option value="below-2000">Below RM 2,000</option>
                <option value="2000-5000">RM 2,000 - RM 5,000</option>
                <option value="5000-above">Above RM 5,000</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">
                Show only cards from
              </label>
              <div className="space-y-2">
                {filters.map((filter, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      value={filter}
                      checked={selectedFilters.includes(filter)}
                      onChange={() => toggleFilter(filter)}
                      className="mr-2"
                    />
                    {filter}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 grid gap-6">
          {cardData.map((card) => (
            <div
              key={card.id}
              className="relative p-4 border rounded-lg bg-white"
            >
              {card.featured && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                  Featured
                </div>
              )}

              <div className="bg-yellow-500 text-white text-sm px-4 py-1 rounded font-semibold mb-2 flex items-center gap-2">
                Flash Deal: {card.flashDeal}{" "}
                <IconInfoCircle size={16} className="inline-block" />
              </div>

              <h2 className="text-xl font-bold text-gray-800">{card.title}</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Min Income:</span>{" "}
                    {card.minIncome}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Interest Rate:</span>{" "}
                    {card.interestRate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Annual Fee:</span>{" "}
                    {card.annualFee}
                  </p>
                </div>
              </div>

              <div className="text-gray-600 mb-4">
                <span className="font-semibold">Rewards Rate:</span>{" "}
                {card.rewardRate}
              </div>

              {/* Dropdowns */}
              <div className="mb-4">
                {["Fees & Charges", "Requirements"].map((section) => (
                  <div key={section}>
                    <button
                      className="flex items-center justify-between w-full pb-2 mb-2 text-left font-semibold text-gray-700"
                      onClick={() => toggleDropdown(card.id, section)}
                    >
                      {section}
                      {openDropdowns[card.id] === section ? (
                        <IconChevronUp size={18} />
                      ) : (
                        <IconChevronDown size={18} />
                      )}
                    </button>
                    {openDropdowns[card.id] === section && (
                      <ul className="pl-4 pb-4">
                        {(section === "Fees & Charges"
                          ? card.fees.map((fee) => fee.description)
                          : card.requirements.map(
                              (requirement) => requirement.description
                            )
                        ).map((item, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button>{card.buttonLabel}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Promo;
