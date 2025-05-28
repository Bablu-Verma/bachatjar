"use client"
import React, { useState } from "react";

interface IFaqItem {
  id: number;
  question: string;
  answer: string;
}

interface IFaqProps {
  faq_question: IFaqItem[];
}

const Faq_client: React.FC<IFaqProps> = ({ faq_question }) => {
  const [openItemId, setOpenItemId] = useState<number | null>(1);

  const toggleAnswer = (id: number) => {
    setOpenItemId((prev) => (prev === id ? null : id));
  };

  return (
    <ul className="list-none list-inside mb-16">
      {faq_question.map((item, i) => (
        <li key={item.id} className={` hover:bg-gray-100 ${openItemId === item.id && "bg-gray-200 hover:bg-gray-200" } mb-3  rounded-md`}>
          <div
            onClick={() => toggleAnswer(item.id)}
            className="text-base cursor-pointer p-4 font-medium text-gray-800 flex justify-between"
          >
            <>Q{i + 1}. {item.question}</>
            
            {
                openItemId === item.id ? <span><i className="fa-solid fa-chevron-up text-lg text-primary"></i></span> :<span><i className="fa-solid fa-chevron-down text-lg text-secondary"></i></span>
            } 
          </div>
          <div className={`${openItemId === item.id ? "block shadow-sm pb-4" : "hidden mb-1"} text-sm  font-normal ml-5 `}>
            <p><span className="font-medium">Ans:</span> {item.answer}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Faq_client;
