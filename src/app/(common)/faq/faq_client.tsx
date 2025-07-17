"use client";
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
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleAnswer = (id: number) => {
    setOpenItemId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = faq_question.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-[400px] mx-auto border border-gray-300 rounded-full text-sm py-2 pl-5 pr-3 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* FAQ List */}
      <ul className="list-none list-inside mb-16">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, i) => (
            <li
              key={item.id}
              className={`hover:bg-gray-100 ${
                openItemId === item.id &&
                "bg-gray-200 hover:bg-gray-200"
              } mb-3 rounded-md`}
            >
              <div
                onClick={() => toggleAnswer(item.id)}
                className="text-base cursor-pointer p-4 font-medium text-gray-600 flex justify-between"
              >
                <>Q{i + 1}. {item.question}</>

                {openItemId === item.id ? (
                  <span>
                    <i className="fa-solid fa-chevron-up text-md text-primary"></i>
                  </span>
                ) : (
                  <span>
                    <i className="fa-solid fa-chevron-down text-md text-secondary"></i>
                  </span>
                )}
              </div>
              <div
                className={`${
                  openItemId === item.id ? "block shadow-sm pb-4" : "hidden"
                } text-sm font-normal ml-5`}
              >
                <p>
                  <span className="font-medium">Ans:</span> {item.answer}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500 p-4">No FAQs found matching your search.</li>
        )}
      </ul>
    </div>
  );
};

export default Faq_client;
