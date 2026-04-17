const StatCard = ({ label, value, helper, tone = "default" }) => {
  const toneMap = {
    default: "from-white/8 via-white/5 to-white/0",
    peach: "from-peach-200/16 via-peach-100/10 to-transparent",
    mint: "from-success-200/16 via-success-100/10 to-transparent",
    brand: "from-accent-400/18 via-brand-300/12 to-transparent",
  };

  return (
    <div className={`surface-card bg-gradient-to-br ${toneMap[tone] || toneMap.default} p-6`}>
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{helper}</p>
    </div>
  );
};

export default StatCard;
