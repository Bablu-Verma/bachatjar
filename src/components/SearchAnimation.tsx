import React, { useEffect, useState } from 'react';

const SearchAnimation = () => {
  const names = [
    'Best deals',
    'Cashback Offers',
    '100% Off Stores',
    'Best Coupons Code',
    'Find Latest Blog'
  ];

  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [backspace, setBackspace] = useState(false);

  useEffect(() => {
    if (index === names.length) return;
  
    let timeout;
  
    if (!backspace && subIndex === names[index].length) {
      // After typing full text, wait 4 seconds before backspacing
      timeout = setTimeout(() => {
        setBackspace(true);
      }, 4000); // 4 seconds wait
    } else {
      timeout = setTimeout(() => {
        if (!backspace) {
          setText(names[index].substring(0, subIndex + 1));
          setSubIndex(subIndex + 1);
        } else {
          setText(names[index].substring(0, subIndex - 1));
          setSubIndex(subIndex - 1);
  
          if (subIndex === 0) {
            setBackspace(false);
            setIndex((prev) => (prev + 1) % names.length);
          }
        }
      }, backspace ? 50 : 100); // typing and backspace speed
    }
  
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subIndex, index, backspace]);
  
  return (
    <span className="w-full bg-gray-200 px-3 border-gray-200 text-sm text-gray-700 border-2 rounded font-medium py-1.5 overflow-hidden flex justify-start items-center h-[36px]">
      Search
      <span className="ml-1">{text}</span>
      <span className="animate-blink ml-1">|</span>
    </span>
  );
};

export default SearchAnimation;
