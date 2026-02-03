type RadioProps = {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

export function Radio({
  id,
  name,
  value,
  checked,
  onChange,
  label,
}: RadioProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer select-none"
    >
      {/* hidden native input */}
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      {/* custom radio */}
      <span
        className={`
          h-4 w-4 rounded-full border-2
          flex items-center justify-center
          transition-all duration-200
          ${
            checked
              ? "border-primary bg-primary"
              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          }
        `}
      >
        {/* inner dot */}
        {checked && (
          <span className="h-2 w-2 rounded-full bg-white" />
        )}
      </span>

      <span className="text-xs lg:text-sm text-gray-800 dark:text-gray-200">
        {label}
      </span>
    </label>
  );
}
