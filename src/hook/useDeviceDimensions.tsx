"use client";

import { useState, useEffect } from "react";

export const useDeviceWidth = (): number | undefined => {
  const [deviceWidth, setDeviceWidth] = useState<number | undefined>(
    typeof window === "undefined" ? undefined : window.innerWidth
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setDeviceWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceWidth;
};



export const useDeviceHeight = (): number | undefined => {
  const [deviceHeight, setDeviceHeight] = useState<number | undefined>(
    typeof window === "undefined" ? undefined : window.innerHeight
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setDeviceHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceHeight;
};