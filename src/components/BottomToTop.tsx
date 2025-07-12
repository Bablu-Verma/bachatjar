"use client";
import React, { useState, useEffect } from "react";

const BottomToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    isVisible && (
      <div
        onClick={scrollToTop}
        className="fixed bottom-24 right-8 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full opacity-70 bg-primary z-40 flex justify-center items-center shadow-lg cursor-pointer hover:bottom-28 duration-300 hover:opacity-95"
      >
        <i className="fa-solid fa-arrow-up text-lg sm:text-xl text-white"></i>
      </div>
    )
  );
};

export default BottomToTop;
