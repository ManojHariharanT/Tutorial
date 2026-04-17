import { cn } from "../../utils/classNames.js";

const Tooltip = ({ content, children, className }) => (
  <span className={cn("group relative inline-flex", className)}>
    {children}
    <span className="pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 z-30 min-w-max -translate-x-1/2 rounded-xl border border-white/10 bg-surface-900 px-3 py-2 text-xs text-slate-200 opacity-0 shadow-panel transition duration-200 group-hover:opacity-100">
      {content}
    </span>
  </span>
);

export default Tooltip;
