import React, { forwardRef } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  ariaLabel?: string;
};

const CloseButton = forwardRef<HTMLButtonElement, Props>(
  ({ ariaLabel = "Close", className = "", ...rest }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        className={`p-2 rounded-full hover:bg-red-500/20 group ${className}`}
        {...rest}
      >
        <FiX className="text-xl group-hover:text-red-500" />
      </button>
    );
  }
);

CloseButton.displayName = "CloseButton";

export default CloseButton;
