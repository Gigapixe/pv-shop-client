"use client";

import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqListProps {
  faqData: FaqItem[];
}

export default function FaqList({ faqData }: FaqListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqData.map((faq, index) => (
        <div key={index}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex justify-between w-full px-4 py-3 text-base font-medium text-left text-gray-600 bg-gray-50 hover:bg-emerald-50 rounded-lg focus:outline-none focus:text-emerald-500 transition-all duration-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
          >
            <span>{faq.question}</span>
            <IoChevronDown
              className={`${
                openIndex === index
                  ? "transform rotate-180 text-emerald-500 dark:text-emerald-400"
                  : ""
              } w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200`}
            />
          </button>
          {openIndex === index && (
            <div className="px-4 pt-3 pb-8 text-sm leading-7 text-gray-500 dark:text-gray-300">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
