const toneClasses = {
  info: "border-accent-400/25 bg-accent-400/10 text-accent-100",
  success: "border-success-200/25 bg-success-300/10 text-success-100",
  warning: "border-gold-200/25 bg-gold-200/10 text-gold-100",
  error: "border-rose-400/25 bg-rose-500/10 text-rose-100",
};

const NoticeBanner = ({ tone = "info", title, children }) => (
  <div className={`rounded-2xl border px-4 py-3 ${toneClasses[tone] || toneClasses.info}`}>
    {title ? <p className="text-sm font-semibold">{title}</p> : null}
    <p className={`text-sm ${title ? "mt-1" : ""}`.trim()}>{children}</p>
  </div>
);

export default NoticeBanner;
