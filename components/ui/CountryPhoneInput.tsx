"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Country } from "country-state-city";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
  CountryCode,
} from "libphonenumber-js";
import Input from "@/components/ui/Input";

interface CountryPhoneInputProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  onChange?: (value: string, countryCode: CountryCode) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

interface CountryOption {
  code: CountryCode;
  name: string;
  dialCode: string; // e.g. "+880"
}

const CountryPhoneInput: React.FC<CountryPhoneInputProps> = ({
  id,
  name,
  label,
  value = "",
  onChange,
  error,
  className = "",
  disabled = false,
  placeholder = "Enter phone number",
  required = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    null,
  );
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userSelectedRef = useRef<boolean>(false);

  const [geoCountryCode, setGeoCountryCode] = useState<CountryCode | null>(
    null,
  );

  // ✅ Build countries list once (memoized)
  const countries: CountryOption[] = useMemo(() => {
    return getCountries()
      .map((countryCode): CountryOption | null => {
        try {
          const countryData = Country.getCountryByCode(countryCode);
          const dialCode = getCountryCallingCode(countryCode);

          if (!countryData) return null;

          return {
            code: countryCode,
            name: countryData.name,
            dialCode: `+${dialCode}`,
          };
        } catch {
          return null;
        }
      })
      .filter((c): c is CountryOption => c !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // ✅ Detect country from IP (client-side)
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Returns plain text like "BD"
        const res = await fetch("https://ipapi.co/country/", {
          cache: "no-store",
        });
        const code = (await res.text()).trim().toUpperCase();

        if (code && getCountries().includes(code as CountryCode)) {
          setGeoCountryCode(code as CountryCode);
        }
      } catch {
      }
    };

    detectCountry();
  }, []);

  // ✅ Set default country:
  // - Quick fallback to US if nothing selected
  // - When geo arrives, override US (unless user manually selected)
  useEffect(() => {
    if (countries.length === 0) return;

    // If user manually picked a country, never override their choice
    if (userSelectedRef.current) return;

    // If geo is available, apply it even if US was already selected
    if (geoCountryCode) {
      const geo = countries.find((c) => c.code === geoCountryCode);
      if (geo && selectedCountry?.code !== geo.code) {
        setSelectedCountry(geo);
      }
      return;
    }

    // If geo not ready yet, set fallback only if none selected yet
    if (!selectedCountry) {
      const fallback = countries.find((c) => c.code === "US") || countries[0];
      setSelectedCountry(fallback);
    }
  }, [countries, geoCountryCode, selectedCountry]);

  // ✅ Parse value prop if provided (keeps national number in input)
  useEffect(() => {
    if (!value) {
      setPhoneNumber("");
      return;
    }

    if (!selectedCountry) return;

    try {
      const parsed = parsePhoneNumber(value, selectedCountry.code);
      if (parsed) {
        setPhoneNumber(parsed.nationalNumber.toString());
      } else {
        setPhoneNumber(value.replace(/[^0-9]/g, ""));
      }
    } catch {
      setPhoneNumber(value.replace(/[^0-9]/g, ""));
    }
  }, [value, selectedCountry]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country: CountryOption) => {
    userSelectedRef.current = true; // ✅ remember manual selection
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery("");

    if (onChange && phoneNumber) {
      const fullNumber = `${country.dialCode}${phoneNumber}`;
      onChange(fullNumber, country.code);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^0-9]/g, "");
    setPhoneNumber(input);

    if (onChange && selectedCountry) {
      const fullNumber = `${selectedCountry.dialCode}${input}`;
      onChange(fullNumber, selectedCountry.code);
    }
  };

  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return countries;

    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(q) ||
        country.dialCode.includes(searchQuery) ||
        country.code.toLowerCase().includes(q),
    );
  }, [countries, searchQuery]);

  return (
    <div className="space-y-2">
      {label && (
        <label
          {...(id ? { htmlFor: id } : {})}
          className="block text-sm font-medium text-text dark:text-text-light"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex gap-2">
        {/* Country Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen((v) => !v)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-3 py-3 border rounded-lg
              border-border-light dark:border-border-dark
              bg-background dark:bg-background-dark
              text-text dark:text-text-light
              hover:bg-gray-50 dark:hover:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark
              ${disabled ? "cursor-not-allowed opacity-60" : ""}
              ${error ? "border-red-500 dark:border-red-400" : ""}
              transition-colors h-[46px]
            `}
          >
            {selectedCountry ? (
              <>
                <img
                  src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png 2x`}
                  alt={`${selectedCountry.name} flag`}
                  className="w-6 h-4 object-cover rounded"
                />
                <span className="text-sm font-medium min-w-[45px] text-left">
                  {selectedCountry.dialCode}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
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
              </>
            ) : (
              <span className="text-sm">Select</span>
            )}
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-50 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>

              {/* Countries List */}
              <div className="overflow-y-auto max-h-80">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-left
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        ${
                          selectedCountry?.code === country.code
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        transition-colors
                      `}
                    >
                      <img
                        src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`}
                        alt={`${country.name} flag`}
                        className="w-6 h-4 object-cover rounded"
                      />
                      <span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {country.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {country.dialCode}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="flex-1">
          <Input
            {...(id ? { id } : {})}
            {...(name ? { name } : {})}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            error={error}
            className={`py-2.5 rounded-lg ${className}`}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CountryPhoneInput;
