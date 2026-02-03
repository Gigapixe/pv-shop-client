"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type AppSelectProps = {
  value: string; // selected option value
  onChange: (value: string, option?: SelectOption) => void;

  options: SelectOption[];

  placeholder?: string; // shown when value === ""
  label?: string;

  searchable?: boolean;
  searchPlaceholder?: string;

  disabled?: boolean;
  className?: string; // wrapper class
  buttonClassName?: string; // trigger class
  menuClassName?: string; // dropdown class

  /** Optional: render label in trigger (e.g. truncate) */
  renderTriggerValue?: (option: SelectOption | undefined) => React.ReactNode;

  /** Optional: max height of dropdown */
  maxMenuHeightPx?: number;
};

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select",
  label,
  searchable = true,
  searchPlaceholder = "Search...",
  disabled = false,
  className = "",
  buttonClassName = "",
  menuClassName = "",
  renderTriggerValue,
  maxMenuHeightPx = 260,
}: AppSelectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  const filtered = useMemo(() => {
    if (!searchable || !q.trim()) return options;
    const s = q.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(s));
  }, [options, q, searchable]);

  // close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // focus search when open
  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    if (!open) {
      setQ("");
      setActiveIndex(-1);
    }
  }, [open, searchable]);

  const commit = (opt: SelectOption) => {
    if (opt.disabled) return;
    onChange(opt.value, opt);
    setOpen(false);
  };

  const triggerText = useMemo(() => {
    if (renderTriggerValue) return renderTriggerValue(selectedOption);
    if (selectedOption) return selectedOption.label;
    return placeholder;
  }, [renderTriggerValue, selectedOption, placeholder]);

  const onKeyDownTrigger = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => {
        const next = Math.min(filtered.length - 1, Math.max(0, prev + 1));
        return next;
      });
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => {
        const next = Math.max(0, prev <= 0 ? 0 : prev - 1);
        return next;
      });
      return;
    }
  };

  const onKeyDownMenu = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(filtered.length - 1, prev + 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(0, prev - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filtered.length) {
        commit(filtered[activeIndex]);
      }
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {label ? (
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          {label}
        </label>
      ) : null}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={onKeyDownTrigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          "w-full",
          "min-w-30 flex items-center justify-between gap-2",
          "px-4 py-2 rounded-full border text-sm",
          "bg-white dark:bg-background-dark",
          "border-gray-200 dark:border-border-dark",
          "text-gray-800 dark:text-gray-100",
          "hover:bg-gray-50 dark:hover:bg-[#1c1c1c]",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "outline-none focus:ring-2 focus:ring-primary",
          buttonClassName,
        ].join(" ")}
      >
        <span className="truncate">
          {typeof triggerText === "string" ? triggerText : triggerText}
        </span>
        <span
          className={`text-gray-400 ${
            open ? "rotate-180 duration-300" : "duration-300"
          }`}
        >
          <IoIosArrowDown />
        </span>
      </button>

      {/* Menu */}
      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          onKeyDown={onKeyDownMenu}
          className={[
            // responsive dropdown
            "absolute left-0 mt-2 z-50",
            "w-full",
            "rounded-2xl border shadow-xl",
            "bg-white dark:bg-background-dark",
            "border-gray-200 dark:border-border-dark",
            menuClassName,
          ].join(" ")}
        >
          {/* Search */}
          {searchable && (
            <div className="p-2">
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={searchPlaceholder}
                className={[
                  "w-full rounded-xl border px-3 py-2 text-sm",
                  "bg-white dark:bg-[#0f0f0f]",
                  "border-gray-200 dark:border-border-dark",
                  "text-gray-900 dark:text-gray-100",
                  "outline-none focus:ring-2 focus:ring-emerald-400/40",
                ].join(" ")}
              />
            </div>
          )}

          {/* Options */}
          <div
            className="py-1 overflow-auto thin-scrollbar"
            style={{ maxHeight: maxMenuHeightPx }}
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No results
              </div>
            ) : (
              filtered.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isActive = idx === activeIndex;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => commit(opt)}
                    className={[
                      "w-full text-left px-3 py-2 text-sm",
                      "flex items-center justify-between gap-3",
                      opt.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer",
                      isSelected
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-gray-800 dark:text-gray-100",
                      isActive
                        ? "bg-gray-100 dark:bg-[#1c1c1c]"
                        : "bg-transparent",
                    ].join(" ")}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected ? (
                      <span className="text-emerald-500">✓</span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
