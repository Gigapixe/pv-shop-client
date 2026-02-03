"use client";
import React from "react";

interface SpinnerProps {
  size?: number;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 40, className = "" }) => {
  const px = `${size}px`;
  return (
    <div
      className={`inline-block ${className}`}
      style={{ width: px, height: px }}
      aria-hidden
    >
      <div
        className={
          "w-full h-full border-4 border-gray-200 rounded-full animate-spin border-t-primary"
        }
        style={{ borderTopColor: "var(--tw-prose-links)" }}
      />
    </div>
  );
};

export default Spinner;
