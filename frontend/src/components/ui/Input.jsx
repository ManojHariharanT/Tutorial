import { forwardRef } from "react";
import { cn } from "../../utils/classNames.js";

const Input = forwardRef(
  ({ className, label, wrapperClassName, icon = null, suffix = null, ...props }, ref) => (
    <label className={cn("block", wrapperClassName)}>
      {label ? <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span> : null}
      <span
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 transition duration-200 focus-within:border-accent-400/70 focus-within:ring-4 focus-within:ring-accent-400/10",
        )}
      >
        {icon ? <span className="text-slate-500">{icon}</span> : null}
        <input
          ref={ref}
          className={cn(
            "w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500",
            className,
          )}
          {...props}
        />
        {suffix ? <span className="text-xs font-medium text-slate-500">{suffix}</span> : null}
      </span>
    </label>
  ),
);

Input.displayName = "Input";

export default Input;
