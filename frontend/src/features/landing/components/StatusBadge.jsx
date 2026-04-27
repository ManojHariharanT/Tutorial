const toneClassMap = {
  HOT: "lp-badge-hot",
  AI: "lp-badge-ai",
  NEW: "lp-badge-new",
  PRO: "lp-badge-pro",
  DONE: "lp-badge-done",
};

const StatusBadge = ({ tone = "NEW", children }) => (
  <span className={`lp-status-badge ${toneClassMap[tone] || toneClassMap.NEW}`}>{children}</span>
);

export default StatusBadge;
