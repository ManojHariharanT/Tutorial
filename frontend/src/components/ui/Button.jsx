import { forwardRef } from "react";
import { cn } from "../../utils/classNames.js";

const variants = {
  primary:
    "bg-accent-400 text-surface-950 shadow-glow hover:-translate-y-0.5 hover:bg-accent-300",
  secondary:
    "border border-white/12 bg-white/5 text-slate-100 hover:border-white/20 hover:bg-white/10",
  gradient:
    "bg-gradient-to-r from-accent-400 via-brand-400 to-gold-200 text-surface-950 shadow-glow hover:-translate-y-0.5 hover:brightness-105",
  ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
};

const sizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const Button = forwardRef(
  (
    {
      as: Component = "button",
      className,
      variant = "primary",
      size = "md",
      type = "button",
      disabled = false,
      ...props
    },
    ref,
  ) => (
    <Component
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55",
        sizes[size] || sizes.md,
        variants[variant] || variants.primary,
        className,
      )}
      disabled={Component === "button" ? disabled : undefined}
      type={Component === "button" ? type : undefined}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export default Button;
