"use client";
import React, { useState, useRef, useEffect } from "react";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import ReactCountryFlag from "react-country-flag";
import ArrowIcon from "@/public/icons/ArrowIcon";

// Register English language for country names
countries.registerLocale(en);

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  className?: string;
}

// Get country codes and names
const countryCodes: string[] = Object.keys(
  countries.getNames("en", { select: "official" }),
);
const countryNames: Record<string, string> = countries.getNames("en", {
  select: "official",
});

export default function CountrySelect({
  value,
  onChange,
  disabled,
  className,
}: CountrySelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Validate the provided value
  const isValidCountry = value && countryCodes.includes(value);
  const selectedName = isValidCountry ? countryNames[value] : "";

  // Filter countries by search (show all if search is empty)
  const filtered = countryCodes.filter((code) => {
    const name = countryNames[code];
    return name.toLowerCase().includes(search.toLowerCase());
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch(""); // Reset search when closing
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative w-full border border-border-light dark:border-border-dark bg-background dark:bg-background-dark py-[7px] px-3 rounded ${
        className || ""
      }`}
      role="combobox"
      aria-expanded={open}
    >
      <div
        className={`flex items-center cursor-pointer text-gray-900 dark:text-gray-100 ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-label={selectedName || "Select Country"}
      >
        {isValidCountry && (
          <span className="mr-2">
            <ReactCountryFlag
              countryCode={value}
              svg
              style={{ width: "1.5em", height: "1.5em" }}
              title={selectedName}
            />
          </span>
        )}
        <span className="text-gray-900 dark:text-gray-100">
          {selectedName || "Select Country"}
        </span>
        <span className="ml-auto transition-all" aria-hidden="true">
          {open ? (
            <ArrowIcon className="rotate-90" />
          ) : (
            <ArrowIcon className="rotate-0" />
          )}
        </span>
      </div>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-auto left-0 top-10">
          <input
            type="text"
            className="w-full px-2 py-1 border-b border-gray-200 dark:border-gray-700 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            aria-label="Search countries"
          />
          <ul className="max-h-48 overflow-auto" role="listbox">
            {filtered.length === 0 ? (
              <li
                className="px-2 py-2 text-gray-500 dark:text-gray-400"
                role="option"
              >
                No countries found
              </li>
            ) : (
              filtered.map((code) => (
                <li
                  key={code}
                  className={`flex items-center px-2 py-2 cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
                    value === code
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : ""
                  }`}
                  onClick={() => {
                    onChange(code); // Pass the country code
                    setOpen(false);
                    setSearch(""); // Reset search on selection
                  }}
                  role="option"
                  aria-selected={value === code}
                >
                  <ReactCountryFlag
                    countryCode={code}
                    svg
                    style={{ width: "1.5em", height: "1.5em" }}
                    className="mr-2"
                    title={countryNames[code]}
                  />
                  <span>{countryNames[code]}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
