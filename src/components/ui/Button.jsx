import React from "react";

const variants = {
  primary:
    "bg-green-600 text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600",
  secondary:
    "border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-green-50/90 hover:border-green-200/80"
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant] || variants.primary,
        className
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
