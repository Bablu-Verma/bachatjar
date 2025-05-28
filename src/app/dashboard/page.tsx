"use client";

import React, { useState } from "react";
import InfoCard from "./_components/InfoCard";
import SelectInput from "./_components/SelectInput";
import { BarChart } from "./_components/Chart";


const Dashboard_ = () => {
  const [, setSelectedMonth] = useState("");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Dashboard
      </h1>
      <div className="grid grid-cols-4 gap-6 py-5">
        <InfoCard />
        <InfoCard />
        <InfoCard />
        <InfoCard />
      </div>
      <div className="py-5 px-3 relative w-full">
        <div className="flex justify-between items-start">
          <h1 className="text-xl pb-6 font-medium text-secondary_color">
            Sales Details
          </h1>
          <SelectInput
            id="month-select"
            options={months}
            defaultValue="Select Month"
            onChange={(value) => setSelectedMonth(value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary outline-none block w-[200px] py-1 px-2.5"
          />
        </div>

        <BarChart />
      </div>
      <div className="py-5 px-3 relative w-full">
        <div className="flex justify-between items-start">
          <h1 className="text-xl pb-6 font-medium text-secondary_color">
            Revenue
          </h1>
          <SelectInput
            id="month-select"
            options={months}
            defaultValue="Select Month"
            onChange={(value) => setSelectedMonth(value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary outline-none block w-[200px] py-1 px-2.5"
          />
        </div>
        <BarChart />
      </div>
      {/* <div className="pt-10 py-5 px-3 relative w-full">
        <div className="flex justify-between items-start">
          <h1 className="text-xl pb-6 font-medium text-secondary_color">
            Deals Details
          </h1>
          <SelectInput  
        id="month-select"
        options={months}
        defaultValue="Select Month"
        onChange={(value) => setSelectedMonth(value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary outline-none block w-[200px] py-1 px-2.5" />
        </div>
        <div className="overflow-x-auto pb-4">
          <table className="min-w-full table-auto border-collapserounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-700  ">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700  ">
                  Location
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700  ">
                  Date-Time
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700  ">
                  Price
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700  ">
                  Amount
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700  ">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white hover:bg-gray-100">
                <td className="px-6 py-4 flex items-center gap-4">
                  <img
                    src="https://m.media-amazon.com/images/I/61ZjlBOp+rL._AC_UF1000,1000_QL80_.jpg"
                    alt="Product Image"
                    className="w-10 h-10 rounded-md"
                  />
                  <span className="text-gray-800">Product Name</span>
                </td>
                <td className="px-6 py-4  text-gray-600">New York</td>
                <td className="px-6 py-4  text-gray-600">
                  2024-11-14 10:30 AM
                </td>
                <td className="px-6 py-4  text-gray-600">$50</td>
                <td className="px-6 py-4  text-gray-600">10</td>
                <td className="px-6 py-4 ">
                  <span className="px-2 py-1 text-sm text-white bg-green-500 rounded-md">
                    Active
                  </span>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-100">
                <td className="px-6 py-4 flex items-center gap-4 ">
                  <img
                    src="https://m.media-amazon.com/images/I/61ZjlBOp+rL._AC_UF1000,1000_QL80_.jpg"
                    alt="Product Image"
                    className="w-10 h-10 rounded-md"
                  />
                  <span className="text-gray-800">Product Name</span>
                </td>
                <td className="px-6 py-4  text-gray-600">New York</td>
                <td className="px-6 py-4  text-gray-600">
                  2024-11-14 10:30 AM
                </td>
                <td className="px-6 py-4  text-gray-600">$50</td>
                <td className="px-6 py-4  text-gray-600">10</td>
                <td className="px-6 py-4 ">
                  <span className="px-2 py-1 text-sm text-white bg-green-500 rounded-md">
                    Active
                  </span>
                </td>
              </tr>
              <tr className="bg-white hover:bg-gray-100">
                <td className="px-6 py-4 flex items-center gap-4 ">
                  <img
                    src="https://m.media-amazon.com/images/I/61ZjlBOp+rL._AC_UF1000,1000_QL80_.jpg"
                    alt="Product Image"
                    className="w-10 h-10 rounded-md"
                  />
                  <span className="text-gray-800">Product Name</span>
                </td>
                <td className="px-6 py-4  text-gray-600">New York</td>
                <td className="px-6 py-4  text-gray-600">
                  2024-11-14 10:30 AM
                </td>
                <td className="px-6 py-4  text-gray-600">$50</td>
                <td className="px-6 py-4  text-gray-600">10</td>
                <td className="px-6 py-4 ">
                  <span className="px-2 py-1 text-sm text-white bg-green-500 rounded-md">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
    </>
  );
};

export default Dashboard_;
