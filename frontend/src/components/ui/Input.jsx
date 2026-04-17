import { forwardRef } from "react";
import { cn } from "../../utils/classNames.js";

const Input = forwardRef(
  ({ className, wrapperClassName, icon = null, suffix = null, ...props }, ref) => (
    <label
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-white/10 bg-surface-850/78 px-4 py-3 transition duration-200 focus-within:border-accent-400/70 focus-within:ring-4 focus-within:ring-accent-400/10",
        wrapperClassName,
      )}
    >
      {icon ? <span className="text-slate-500">{icon}</span> : null}
      <input
        ref={ref}
        className={cn(
          "w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500",
          className,
        )}
        {...props}
      />
      {suffix ? <span className="text-xs font-medium text-slate-500">{suffix}</span> : null}
    </label>
  ),
);

Input.displayName = "Input";

export default Input;
