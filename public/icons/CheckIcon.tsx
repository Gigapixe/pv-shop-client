const CheckIcon = ({ className = "" }: { className?: string }) => (
  <span
    className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white ${className}`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);
export default CheckIcon;
