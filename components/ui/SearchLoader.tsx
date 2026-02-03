"use client"; // Required for Next.js App Router (client-side rendering)

interface LoadingSpinnerProps {
  size?: number | string; // Size of the spinner (width and height)
  color?: string; // Primary color for spinner and text
  textSize?: number | string; // Size of the "Loading..." text
  loadingText?: string; // Text to display below the spinner
}

export default function LoadingSpinner({
  size = 40,
  color = "#12b47e", // Default: Indigo (works on light/dark themes)
  textSize = 16, // Default: 16px for text
  loadingText = "Loading",
}: LoadingSpinnerProps) {
  return (
    <div
      className="loading-spinner-container"
      style={{ "--spinner-color": color } as React.CSSProperties}
      aria-label="Loading"
    >
      <div
        className="loading-spinner"
        style={{
          width: typeof size === "number" ? `${size}px` : size,
          height: typeof size === "number" ? `${size}px` : size,
        }}
      >
        <div className="loading-spinner-orbit" />
        <div className="loading-spinner-orbit" />
      </div>
      <div
        className="loading-spinner-text"
        style={{
          fontSize: typeof textSize === "number" ? `${textSize}px` : textSize,
        }}
      >
        {loadingText}
        <span className="loading-spinner-dot">.</span>
        <span className="loading-spinner-dot">.</span>
        <span className="loading-spinner-dot">.</span>
      </div>
    </div>
  );
}