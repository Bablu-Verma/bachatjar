import React from 'react'

const InfoCard = () => {
  return (
    <div className="bg-white rounded-2xl p-6 justify-between flex flex-col shadow">
    <div className="flex justify-between pb-4 items-start">
      <div className="pl-2">
        <p className="text-gray-500 text-lg font-normal">Total User</p>
        <h3 className="text-secondary_color text-3xl font-semibold my-3">
          ₹8688
        </h3>
      </div>
      <div className="bg-blue-100 rounded-3xl p-4 mt-2 flex justify-center items-center">
        <i className="fa-solid fa-user-group text-blue-400 text-3xl"></i>
      </div>
    </div>
    <p className="text-sm text-gray-400">
      <span className="text-green-700 pr-1">
        <i className="fa-solid fa-arrow-trend-up text-green-700"></i>
        8.5%
      </span>
      Up from yesterday
    </p>
  </div>
  )
}

export default InfoCard