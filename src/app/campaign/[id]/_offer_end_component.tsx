"use client";

import React, { useEffect, useState } from "react";

interface IOffer {
  time_data: Date;
}

const Offer_end_component: React.FC<IOffer> = ({ time_data }) => {
  const [time_, setTime_] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTime = get_time(time_data);
      if (updatedTime) {
        setTime_(updatedTime); // Update the state with the new countdown time
      } else {
        clearInterval(timer); // Clear the interval if the time is over
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval when the component unmounts
  }, [time_data]); // Run the effect only when time_data changes

  const get_time = (time_data: Date) => {
    const expireTime = new Date(time_data);
    const currentTime = new Date();

    if (isNaN(expireTime.getTime()) || isNaN(currentTime.getTime())) {
      return "Invalid Date";
    }

    const timeDifference = expireTime.getTime() - currentTime.getTime();

    if (timeDifference <= 0) {
      return ""; // Return an empty string if the time is over
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Days
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Hours
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Minutes
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000); // Seconds

    if (days > 0) {
      return `${days}d-${hours}h-${minutes}m-${seconds}s`;
    }

    return `${hours}h-${minutes}m-${seconds}s`;
  };

  return (
    <>
      {time_ && (
        <div className="">
          <big className="text-base font-medium mr-1">{time_}</big>{" "}
          <span className="text-sm font-normal text-red-500">Offer End soon</span>
        </div>
      )}
    </>
  );
};

export default Offer_end_component;
