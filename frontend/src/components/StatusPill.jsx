const palette = {
  Accepted: "border border-success-200/25 bg-success-300/12 text-success-100",
  "Try Again": "border border-gold-200/25 bg-gold-200/12 text-gold-100",
  "Runtime Error": "border border-rose-300/25 bg-rose-500/12 text-rose-100",
  Executed: "border border-accent-400/25 bg-accent-400/12 text-accent-100",
  Success: "border border-success-200/25 bg-success-300/12 text-success-100",
  Failed: "border border-rose-300/25 bg-rose-500/12 text-rose-100",
  "Demo Mode": "border border-white/10 bg-white/6 text-slate-200",
  Easy: "border border-success-200/25 bg-success-300/12 text-success-100",
  Medium: "border border-gold-200/25 bg-gold-200/12 text-gold-100",
  Hard: "border border-rose-300/25 bg-rose-500/12 text-rose-100",
};

const StatusPill = ({ children }) => (
  <span className={`status-pill ${palette[children] || "border border-white/10 bg-white/5 text-slate-300"}`}>
    {children}
  </span>
);

export default StatusPill;
