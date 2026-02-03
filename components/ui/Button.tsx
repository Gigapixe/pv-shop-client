import React from "react";
import Link from "next/link";

// Define the props interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  btnType?: "primary" | "secondary" | "outline" | "custom";
  colorScheme?: string;
  className?: string;
  children: React.ReactNode;
  href?: string;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  spinnerColor?: string;
  arrowIcon?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  btnType = "primary",
  colorScheme = "default",
  className = "",
  children,
  href = "",
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  spinnerColor = "var(--color-text-light)",
  arrowIcon = false,
  ...restProps
}) => {
  // Spinner component
  const Spinner = () => (
    <div
      className="h-4 w-4 border-b-2 border-r-2 rounded-full animate-spin"
      style={{ borderColor: spinnerColor }}
    ></div>
  );

  // Define button styles based on btnType using Tailwind CSS with custom theme
  const getButtonClasses = () => {
    let baseClasses =
      "text-center px-4 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-4 lg:py-2 rounded-full flex items-center justify-center gap-2 font-semibold transition-all duration-300";

    const primaryStyles =
      "bg-[var(--color-primary)] text-[var(--color-text-light)] hover:bg-[var(--color-primary-dark)] dark:bg-[var(--color-primary-dark)] dark:hover:bg-[var(--color-primary)]";
    const secondaryStyles =
      "bg-[var(--color-secondary)] text-[var(--color-text-light)] hover:bg-[var(--color-secondary-dark)] dark:bg-[var(--color-secondary-dark)] dark:hover:bg-[var(--color-secondary)]";
    const outlineStyles =
      "border border-[var(--color-border-light)] text-[var(--color-text)] hover:bg-[var(--color-background-light)] dark:border-[var(--color-border-dark)] dark:text-[var(--color-text-light)] dark:hover:bg-[var(--color-background-dark-2)]";

    switch (btnType) {
      case "primary":
        return `${baseClasses} ${primaryStyles} ${className}`;
      case "secondary":
        return `${baseClasses} ${secondaryStyles} ${className}`;
      case "outline":
        return `${baseClasses} ${outlineStyles} ${className}`;
      case "custom":
        return `${baseClasses} ${className}`;
      default:
        return `${baseClasses} ${className}`;
    }
  };

  // Handle internal anchor links with smooth scroll
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Content alignment (always centered)
  const contentClasses = "flex items-center w-full gap-2 justify-center";

  // Custom button with link support
  if (btnType === "custom") {
    // Internal anchor link
    if (href && href.startsWith("#")) {
      return (
        <a
          href={href}
          onClick={handleClick}
          className={`${className} ${
            disabled ? "pointer-events-none cursor-not-allowed opacity-60" : ""
          }`}
        >
          <span className={contentClasses}>
            {loading && <Spinner />}
            {loading ? loadingText : children}
            {!loading && arrowIcon && (
              <span className="text-primary bg-white p-1 rounded-full">
                <FiArrowRight />
              </span>
            )}
          </span>
        </a>
      );
    }
    // Next.js link navigation
    if (href && (href.startsWith("/") || href.startsWith("http"))) {
      return (
        <Link href={href} passHref>
          <button
            className={`${className} ${
              disabled
                ? "pointer-events-none cursor-not-allowed opacity-60"
                : ""
            }`}
            disabled={disabled || loading}
            {...restProps}
          >
            <span className={contentClasses}>
              {loading && <Spinner />}
              {loading ? loadingText : children}
              {!loading && arrowIcon && (
                <span className="text-primary bg-white p-1 rounded-full">
                  <FiArrowRight />
                </span>
              )}
            </span>
          </button>
        </Link>
      );
    }
    // Regular button
    return (
      <button
        className={`${className} ${
          disabled ? "pointer-events-none cursor-not-allowed opacity-60" : ""
        }`}
        disabled={disabled || loading}
        {...restProps}
      >
        <span className={contentClasses}>
          {loading && <Spinner />}
          {loading ? loadingText : children}
          {!loading && arrowIcon && (
            <span className="text-primary bg-white p-1 rounded-full">
              <FiArrowRight />
            </span>
          )}
        </span>
      </button>
    );
  }

  // Anchor link for internal navigation
  if (href && href.startsWith("#")) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={`${getButtonClasses()} ${
          disabled ? "pointer-events-none cursor-not-allowed opacity-60" : ""
        }`}
      >
        <span className={contentClasses}>
          {loading && <Spinner />}
          {loading ? loadingText : children}
          {!loading && arrowIcon && (
            <span className="text-primary bg-white p-1 rounded-full">
              <FiArrowRight />
            </span>
          )}
        </span>
      </a>
    );
  }

  // Link button for Next.js navigation
  if (href) {
    return (
      <Link href={href} passHref>
        <button
          className={`${getButtonClasses()} ${
            disabled ? "pointer-events-none cursor-not-allowed opacity-60" : ""
          }`}
          disabled={disabled || loading}
          {...restProps}
        >
          <span className={contentClasses}>
            {loading && <Spinner />}
            {loading ? loadingText : children}
            {!loading && arrowIcon && (
              <span className="text-primary bg-white p-1 rounded-full">
                <FiArrowRight />
              </span>
            )}
          </span>
        </button>
      </Link>
    );
  }

  // Regular button
  return (
    <button
      type="button"
      className={`${getButtonClasses()} ${
        disabled ? "pointer-events-none cursor-not-allowed opacity-60" : ""
      }`}
      disabled={disabled || loading}
      {...restProps}
    >
      <span className={contentClasses}>
        {loading && <Spinner />}
        {loading ? loadingText : children}
        {!loading && arrowIcon && (
          <span className="text-primary bg-white p-1 rounded-full">
            <FiArrowRight />
          </span>
        )}
      </span>
    </button>
  );
};

export default Button;
