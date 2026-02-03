import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useId,
} from "react";

export type OtpInputProps = {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;

  /** wrapper for the row of inputs */
  inputsWrapperClassName?: string;

  /** per-input class */
  inputClassName?: string;

  name?: string;
  label?: string;
  labelClassName?: string;
  labelSrOnly?: boolean;
};

export type OtpInputHandle = {
  focus: () => void;
  clear: () => void;
};

const OtpInput = React.forwardRef<OtpInputHandle, OtpInputProps>(
  (
    {
      length = 6,
      value,
      onChange,
      autoFocus = false,
      disabled = false,
      className = "",
      inputsWrapperClassName = "",
      // ✅ mobile: flex-1 so boxes stretch & align with the button width
      // ✅ min-w keeps them usable; max-w prevents huge boxes on large screens
      inputClassName =
        "flex-1 min-w-[44px] max-w-[52px] h-12 text-center text-lg md:text-xl font-semibold bg-white dark:bg-[#1F1F1F] border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors",
      name,
      label,
      labelClassName = "text-sm text-gray-600 dark:text-gray-400 mb-2",
      labelSrOnly = false,
    },
    ref
  ) => {
    const [internal, setInternal] = useState<string>(value ?? "");
    const isControlled = typeof value !== "undefined";
    const current = isControlled ? value! : internal;

    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const id = useId();

    useEffect(() => {
      if (isControlled) return;
      setInternal((v) => v.slice(0, length));
    }, [length, isControlled]);

    useEffect(() => {
      if (!isControlled && autoFocus) inputsRef.current[0]?.focus();
    }, [autoFocus, isControlled]);

    useEffect(() => {
      if (!isControlled && disabled) setInternal("");
    }, [disabled, isControlled]);

    useImperativeHandle(ref, () => ({
      focus: () => inputsRef.current[0]?.focus(),
      clear: () => {
        if (isControlled) onChange?.("");
        else setInternal("");
      },
    }));

    const updateValueAt = (index: number, digit: string) => {
      const arr = current.split("").slice(0, length);
      while (arr.length < length) arr.push("");
      arr[index] = digit;
      const newVal = arr.join("");
      if (isControlled) onChange?.(newVal);
      else setInternal(newVal);
    };

    const handleChange = (index: number, raw: string) => {
      if (disabled) return;
      const digit = raw.replace(/[^0-9]/g, "").slice(-1);
      if (!digit) {
        updateValueAt(index, "");
        return;
      }
      updateValueAt(index, digit);
      if (index < length - 1) inputsRef.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        const arr = current.split("");
        if ((arr[index] ?? "") !== "") {
          updateValueAt(index, "");
        } else if (index > 0) {
          inputsRef.current[index - 1]?.focus();
          updateValueAt(index - 1, "");
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (disabled) return;
      const pasted = e.clipboardData
        .getData("text")
        .replace(/[^0-9]/g, "")
        .slice(0, length);

      if (!pasted) return;

      const arr = pasted.split("");
      const full = arr.concat(Array(length - arr.length).fill(""));
      const newVal = full.slice(0, length).join("");

      if (isControlled) onChange?.(newVal);
      else setInternal(newVal);

      const nextIndex = Math.min(arr.length, length - 1);
      inputsRef.current[nextIndex]?.focus();
    };

    const renderInputs = () => {
      const arr = current.split("");
      while (arr.length < length) arr.push("");

      return arr.map((digit, i) => (
        <input
          key={i}
          name={name ? `${name}-${i}` : undefined}
          id={`${id}-${i}`}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          className={inputClassName}
        />
      ));
    };

    return (
      <div className={`${className} w-full flex flex-col items-start gap-2`}>
        {label && (
          <label
            htmlFor={`${id}-0`}
            className={`${labelSrOnly ? "sr-only " : ""}${labelClassName}`}
          >
            {label}
          </label>
        )}

        {/* ✅ w-full + justify-between makes the row match button width on mobile */}
        <div
          className={`w-full flex items-center justify-between gap-2 ${inputsWrapperClassName}`}
        >
          {renderInputs()}
        </div>
      </div>
    );
  }
);

OtpInput.displayName = "OtpInput";
export default OtpInput;
