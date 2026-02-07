"use client";

import React from "react";
import Link from "next/link";
import ButtonArrowIcon from "@/public/icons/ButtonArrowIcon";

type ButtonVariant = "primary" | "secondary" | "outline" | "custom";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  href?: string;

  loading?: boolean;
  loadingText?: string;

  disabled?: boolean;
  spinnerColor?: string;

  arrowIcon?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href = "",

  loading = false,
  loadingText = "Loading...",

  disabled = false,
  spinnerColor = "var(--color-text-light)",

  arrowIcon = false,
  ...restProps
}: ButtonProps) {
  const base =
    "text-center rounded-full flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 dark:focus:ring-offset-[var(--color-background-dark)]";

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 md:px-4 md:py-2 text-base",
    lg: "px-5 py-2.5 text-[18px]",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--color-primary)] text-[var(--color-text-light)] hover:bg-[var(--color-primary-dark)] dark:bg-[var(--color-primary-dark)] dark:hover:bg-[var(--color-primary)]",
    secondary:
      "bg-[var(--color-secondary)] text-[var(--color-text-light)] hover:bg-[var(--color-secondary-dark)] dark:bg-[var(--color-secondary-dark)] dark:hover:bg-[var(--color-secondary)]",
    outline:
      "border border-[var(--color-border-light)] text-[var(--color-text)] hover:bg-[var(--color-background-light)] dark:border-[var(--color-border-dark)] dark:text-[var(--color-text-light)] dark:hover:bg-[var(--color-background-dark-2)]",
    custom: "",
  };

  const isDisabled = disabled || loading;
  const disabledClasses = isDisabled
    ? "opacity-60 cursor-not-allowed pointer-events-none"
    : "";

  const buttonClasses =
    variant === "custom"
      ? `${className} ${disabledClasses}`.trim()
      : `${base} ${sizes[size]} ${variants[variant]} ${className} ${disabledClasses}`.trim();

  const content = (
    <span className="flex items-center w-full gap-2 justify-center">
      {loading && (
        <span
          className="h-4 w-4 border-b-2 border-r-2 rounded-full animate-spin"
          style={{ borderColor: spinnerColor }}
        />
      )}

      {loading ? loadingText : children}

      {!loading && arrowIcon && (
        <span className="rounded-full">
          <ButtonArrowIcon className="w-4 h-4" />
        </span>
      )}
    </span>
  );

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Anchor link
  if (href && href.startsWith("#")) {
    return (
      <a href={href} onClick={handleAnchorClick} className={buttonClasses}>
        {content}
      </a>
    );
  }

  // Link navigation
  if (href) {
    return (
      <Link href={href} passHref>
        <button className={buttonClasses} disabled={isDisabled} {...restProps}>
          {content}
        </button>
      </Link>
    );
  }

  // Regular button
  return (
    <button
      type="button"
      className={buttonClasses}
      disabled={isDisabled}
      {...restProps}
    >
      {content}
    </button>
  );
}
