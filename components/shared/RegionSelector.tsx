"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Region {
  name: {
    en: string;
  };
  slug: string;
  flag?: string;
  icon?: string;
}

interface RegionSelectorProps {
  regions: Region[];
  selectedSlug: string;
  onRegionChange: (slug: string) => void;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

export default function RegionSelector({
  regions,
  selectedSlug,
  onRegionChange,
  label = "Region",
  showLabel = true,
  className = "",
}: RegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedRegion = regions.find((r) => r.slug === selectedSlug);

  // Normalize small strings for matching
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[\._\-]+/g, " ")
      .replace(/[^a-z0-9 ]/g, "")
      .trim();

  // Map common abbreviations/aliases to canonical names (add more as needed)
  const aliasMap: Record<string, string> = {
    // US
    us: "united states",
    usa: "united states",
    "u s": "united states",
    america: "united states",
    "u.s.": "united states",

    // UK
    uk: "united kingdom",
    gb: "united kingdom",
    england: "united kingdom",
    britain: "united kingdom",

    // UAE
    ua: "united arab emirates",
    uae: "united arab emirates",
    "u a e": "united arab emirates",
    emirates: "united arab emirates",

    // KSA / Saudi
    ks: "saudi arabia",
    ksa: "saudi arabia",
    "k s a": "saudi arabia",
    saudi: "saudi arabia",
    "kingdom of saudi arabia": "saudi arabia",
  };

  const normalizedQuery = normalize(searchQuery);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  // If query matches an alias (or contains an alias token), prefer matching those
  const aliasTarget =
    aliasMap[normalizedQuery] ?? tokens.map((t) => aliasMap[t]).find(Boolean);

  const filteredRegions = regions.filter((region) => {
    if (!normalizedQuery) return true; // no filter when empty

    const name = normalize(region.name.en || "");

    if (aliasTarget) {
      // Match canonical name or fall back to partial token matches
      return name.includes(aliasTarget) || tokens.some((t) => name.includes(t));
    }

    // default substring match on normalized strings
    return name.includes(normalizedQuery);
  });

  // Close dropdown when clicking outside
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

  const handleRegionSelect = (slug: string) => {
    onRegionChange(slug);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div
      className={`relative flex items-center gap-2 ${className}`}
      ref={dropdownRef}
    >
      {showLabel && (
        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {/* Selected Region Display */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-[#0f1621] border border-gray-200 dark:border-gray-600 rounded-lg hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
        >
          <div className="flex items-center gap-3">
            {(selectedRegion?.flag || selectedRegion?.icon) && (
              <Image
                src={selectedRegion.flag || selectedRegion.icon!}
                alt={selectedRegion.name.en}
                width={100}
                height={100}
                className="w-6 h-4 object-cover rounded"
                loading="lazy"
              />
            )}
            <span className="text-gray-900 dark:text-gray-200 font-medium text-sm">
              {selectedRegion?.name.en || "Select Region"}
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
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
        </button>

        {/* Dropdown Menu (positioned under the trigger) */}
        {isOpen && (
          <div className="absolute left-0 top-full z-10 w-full mt-2 bg-white dark:bg-[#0f1621] border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-96 overflow-hidden">
            {/* Search Box */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search regions..."
                  className="w-full px-4 py-2 pr-10 bg-white dark:bg-[#0f1621] border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Regions List */}
            <div className="overflow-y-auto max-h-80 thin-scrollbar">
              {filteredRegions.length > 0 ? (
                filteredRegions.map((region) => {
                  const isSelected = region.slug === selectedSlug;
                  return (
                    <button
                      key={region.slug}
                      type="button"
                      onClick={() => handleRegionSelect(region.slug)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#0f1621] transition-colors ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-[#0d3d3d] text-primary"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {region.flag || region.icon ? (
                          <Image
                            src={region.flag || region.icon!}
                            alt={region.name.en}
                            width={100}
                            height={100}
                            className="w-6 h-4 object-cover rounded"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-6 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        )}
                        <span className="font-medium text-sm">{region.name.en}</span>
                      </div>
                      {isSelected && (
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  No regions found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
