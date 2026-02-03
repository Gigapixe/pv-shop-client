"use client";

import { useState } from "react";

interface RichTextCollapseProps {
  html?: string | null;
  title?: string;
  initiallyOpen?: boolean;
  className?: string;
  sanitize?: boolean; // basic sanitize (removes <script> and inline event handlers)
  transform?: (html?: string | null) => string | undefined;
}

export default function RichTextCollapse({
  html,
  title = "Product Description",
  initiallyOpen = false,
  className = "",
  sanitize = true,
  transform,
}: RichTextCollapseProps) {
  const [isOpen, setIsOpen] = useState<boolean>(initiallyOpen);

  const toggle = () => setIsOpen((s) => !s);

  const ArrowIcon = ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-6 h-6 transition-transform duration-200 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  const basicSanitize = (raw?: string | null) => {
    if (!raw) return "";
    // Remove script tags
    let out = raw.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
    // Remove inline event handlers (on...=)
    out = out.replace(/on\w+="[^"]*"/gi, "");
    out = out.replace(/on\w+='[^']*'/gi, "");
    return out;
  };

  const processed = transform ? transform(html) : html;
  const content = sanitize ? basicSanitize(processed) : processed || "";

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm p-4 dark:bg-gray-800 dark:shadow-md ${className}`}
    >
      <button
        onClick={toggle}
        className="w-full text-xl font-extrabold text-left py-2 text-gray-600 dark:text-gray-300 flex justify-between items-center"
        aria-expanded={isOpen}
      >
        {title}
        <span>
          {isOpen ? <ArrowIcon className="-rotate-180" /> : <ArrowIcon />}
        </span>
      </button>

      {isOpen && (
        <div className="py-2 text-gray-600 prose max-w-none dark:text-gray-300">
          <div
            dangerouslySetInnerHTML={{
              __html: content || "",
            }}
          />
        </div>
      )}
    </div>
  );
}
