import React from "react";

const HowToWork = () => {
  const howwork = [
    {
      id: 1,
      title: "Sign Up for FREE",
      text: "Simple enter your email, create a password",
      icon: 'fa-user'
    },
    {
      id: 1,
      title: "Shop Normally",
      text: "Select from over 100+ Online stores & Shop.",
      icon: 'fa-cart-shopping'
    },
    {
      id: 1,
      title: "Cashback",
      text: "Cashback will be automatically tracked with in 24-48hrs",
      icon: 'fa-wallet'
    },
  ];
  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 lg:py-6 gap-5 sm:gap-12 lg:gap-16 flex justify-center flex-col sm:flex-row">
      <div className="flex justify-center items-center sm:text-start flex-col ">
        <p className="text-lg text-nowrap text-primary font-medium">Get Cashback in</p>
        <div className="flex items-center">
          <h1 className="text-9xl font-semibold text-primary">3</h1>
          <div>
            <p className="text-3xl font-semibold text-primary">Easy</p>
            <p className="text-3xl font-semibold text-primary">Steps</p>
          </div>
        </div>
      </div>
      {howwork.map((item, i) => (
        <div className="flex justify-center text-center flex-col items-center" key={i}>
          <div className="bg-gray-400 rounded-full w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px] flex justify-center items-center mb-2">
            <div className="bg-black rounded-full w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[75px] md:h-[75px] flex justify-center items-center">
              <i className={`fa-solid ${item.icon} text-2xl sm:text-3xl md:text-4xl text-white`}></i>
            </div>
          </div>
          <h3 className="uppercase text:xl md:text-xl font-bold pb-1 pt-3 text-black">
            {item.title}
          </h3>
          <p className="text-sm sm:text-base font-normal text-gray-700">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HowToWork;

