import { cn } from "../../utils/classNames.js";

const toneClasses = {
  neutral: "border-white/10 bg-white/5 text-slate-200",
  accent: "border-accent-400/25 bg-accent-400/12 text-accent-100",
  easy: "border-success-200/30 bg-success-300/12 text-success-100",
  medium: "border-gold-200/30 bg-gold-200/12 text-gold-100",
  hard: "border-rose-300/25 bg-rose-500/12 text-rose-100",
  tag: "border-brand-300/25 bg-brand-400/12 text-brand-100",
};

const normalizeTone = (tone) => {
  if (tone === "Easy") {
    return "easy";
  }

  if (tone === "Medium") {
    return "medium";
  }

  if (tone === "Hard") {
    return "hard";
  }

  return tone;
};

const Badge = ({ className, tone = "neutral", children, ...props }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
      toneClasses[normalizeTone(tone)] || toneClasses.neutral,
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

export default Badge;
