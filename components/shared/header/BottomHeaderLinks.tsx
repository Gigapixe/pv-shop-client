"use client";

import { useState } from "react";
import Link from "next/link";
import DownArrowIcon from "@/public/icons/DownArrowIcon";

const bottomLinks = [
  { label: "Google", href: "#" },
  { label: "Outlook/Hotmail", href: "#" },
  { label: "Yahoo", href: "#" },
  { label: "Youtube", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Tinder", href: "#" },
  { label: "Pinterest", href: "#" },
  { label: "Others", href: "#" },
];

export default function BottomHeaderLinks() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex items-center divide-x divide-white/20">
      {bottomLinks.map((item, index) => (
        <div
          key={item.label}
          className="relative px-5 py-3 cursor-pointer"
          onMouseEnter={() => setOpenIndex(index)}
          onMouseLeave={() => setOpenIndex(null)}
        >
          {/* Trigger */}
          <div className="flex items-center gap-1 text-white text-[16px] font-medium leading-[160%] capitalize">
            {item.label}
            <DownArrowIcon className="w-4 h-4 opacity-90" />
          </div>

          {/* Dropdown (placeholder) */}
          {openIndex === index && (
            <div className="absolute left-0 top-full mt-1 min-w-40 rounded-md bg-white shadow-lg z-50">
              <Link
                href={item.href}
                className="block px-4 py-2 text-sm text-text-dark hover:bg-gray-100"
              >
                Option 1
              </Link>
              <Link
                href={item.href}
                className="block px-4 py-2 text-sm text-text-dark hover:bg-gray-100"
              >
                Option 2
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
