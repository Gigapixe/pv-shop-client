"use client";

import SectionLabel from "@/components/ui/SectionLabel";
import { useState } from "react";

const FAQS = [
  {
    q: "What Is A PVA Account?",
    a: "A PVA (Phone Verified Account) is an account that has been verified using a real phone number. This ensures authenticity, better security, and higher trust levels across platforms like Gmail, Twitter, YouTube, and more.",
  },
  {
    q: "Are These Accounts Safe To Use?",
    a: "Yes. Our accounts are created with safety practices in mind. We recommend warming up accounts and using best practices to maintain longevity.",
  },
  {
    q: "How Long Does Delivery Take?",
    a: "Delivery time depends on the package size and platform. Most orders are fulfilled quickly and you’ll receive updates during processing.",
  },
  {
    q: "What If An Account Doesn’t Work?",
    a: "We provide a replacement policy. If any account is not working within the agreed conditions, contact support and we’ll help you resolve it.",
  },
  {
    q: "Can I Buy Custom Or Bulk Packages?",
    a: "Absolutely. We support custom requests and bulk orders. Reach out to support with your requirements for a tailored offer.",
  },
];

function IconCircle({ open }: { open: boolean }) {
  return (
    <span
      className={[
        "flex h-8 w-8 items-center justify-center rounded-full border transition",
        open
          ? "bg-black border-black text-white"
          : "bg-white border-gray-300 text-text-dark dark:bg-background-dark-2 dark:border-white/15 dark:text-background",
      ].join(" ")}
      aria-hidden="true"
    >
      {open ? (
        // minus
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path fill="currentColor" d="M5 11h14v2H5z" />
        </svg>
      ) : (
        // plus
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path
            fill="currentColor"
            d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"
          />
        </svg>
      )}
    </span>
  );
}

export default function FaqList() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="w-full bg-white dark:bg-background-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold text-text-dark dark:text-background">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-background/70">
            Here are some of the most common questions our customers ask
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-10 max-w-3xl mx-auto space-y-4">
          {FAQS.map((item, idx) => {
            const open = idx === openIndex;

            return (
              <div
                key={item.q}
                className={[
                  "rounded-2xl overflow-hidden transition",
                  open
                    ? "bg-[#DE5A2E] text-white"
                    : "bg-gray-50 text-text-dark dark:bg-[#282828] dark:text-background",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={[
                        "font-semibold",
                        open ? "text-white" : "text-text-dark dark:text-background",
                      ].join(" ")}
                    >
                      {idx + 1}.
                    </span>

                    <span
                      className={[
                        "font-semibold",
                        open ? "text-white" : "text-text-dark dark:text-background",
                      ].join(" ")}
                    >
                      {item.q}
                    </span>
                  </div>

                  <IconCircle open={open} />
                </button>

                {open && (
                  <div className="px-6 pb-6 -mt-2">
                    <p className="text-sm leading-relaxed text-white/90">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
