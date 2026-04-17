const LoadingState = ({ label = "Loading..." }) => (
  <div className="surface-card flex min-h-48 items-center justify-center gap-3 px-6 py-10 text-sm font-medium text-slate-300">
    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent-400" />
    {label}
  </div>
);

export default LoadingState;
