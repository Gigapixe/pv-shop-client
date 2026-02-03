"use client";

import { useState, useRef, useEffect } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  id: string;
  label?: string;
  error?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
}

const SelectDropdown: React.FC<SelectProps> = ({
  id,
  label,
  error,
  options,
  value,
  onChange,
  className = "",
  disabled = false,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef<HTMLDivElement>(null);

  // Update internal state when value prop changes
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string | number) => {
    setSelectedValue(optionValue);
    setIsOpen(false);

    // Trigger the onChange event to mimic native select behavior
    if (onChange) {
      const syntheticEvent = {
        target: { value: String(optionValue) },
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
    }
  };

  // Find the selected option, ensuring we compare values as strings
  const selectedOption = options.find(
    (option) => String(option.value) === String(selectedValue)
  );

  // Use the selected option's label or fallback to the first option if available
  const displayText = selectedOption
    ? selectedOption.label
    : options.length > 0
    ? options[0].label
    : "Select an option";

  return (
    <div className="relative" ref={selectRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text dark:text-text-light mb-2"
        >
          {label}
        </label>
      )}

      {/* Custom select button */}
      <div
        id={id}
        className={`
          w-full px-3 py-2 border rounded-md 
          border-border-light dark:border-border-dark
          bg-background dark:bg-background-dark
          text-text dark:text-text-light
          focus:outline-none focus:ring-2 focus:ring-primary 
          dark:focus:ring-primary-dark
          ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
          ${error ? "border-red-500 dark:border-red-400" : ""}
          ${className}
          relative
          transition-all duration-200
          flex items-center justify-between
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="truncate">{displayText}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
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
      </div>

      {/* Dropdown options */}
      {isOpen && !disabled && (
        <div
          className={`absolute z-10 w-full mt-1 bg-white dark:bg-background-dark
          border border-border-light dark:border-border-dark
          rounded-md shadow-lg overflow-hidden ${className}`}
        >
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`
                  px-3 py-2 cursor-pointer transition-colors duration-150
                  ${
                    String(option.value) === String(selectedValue)
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default SelectDropdown;
