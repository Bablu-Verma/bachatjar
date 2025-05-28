import React, { useState, useEffect } from "react";

const RandomColor: React.FC = () => {
  const [randomColor, setRandomColor] = useState<string>("");

  const getRandomRGBA = (): string => {
    const randomValue = () => Math.floor(Math.random() * 200);
    return `rgba(${randomValue()}, ${randomValue()}, ${randomValue()}, 0.7)`;
  };

  useEffect(() => {
    setRandomColor(getRandomRGBA());
  }, []);

  return randomColor ? <div className="min-h-1 w-16 rounded-r-full" style={{ backgroundColor: randomColor }} /> : null;
};

export default RandomColor;
