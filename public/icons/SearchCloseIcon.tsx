const SearchCloseIcon = ({
  fill = "currentColor",
  size = 24,
  className = "",
}) => {
  return (
    <svg
      fill={fill}
      width={size}
      height={size}
      className={`${className}`}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L15 15M1 15L15 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SearchCloseIcon;
