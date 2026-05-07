const PageHeader = ({ eyebrow, title, description, actions = null, light = false }) => (
  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      {eyebrow ? (
        <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${light ? "text-blue-600" : "text-accent-200/80"}`}>
          {eyebrow}
        </p>
      ) : null}
      <h1 className={`mt-3 text-3xl font-semibold sm:text-4xl ${light ? "text-slate-900" : "text-white"}`}>{title}</h1>
      <p className={`mt-3 max-w-2xl text-sm leading-7 ${light ? "text-slate-600" : "text-slate-400"}`}>{description}</p>
    </div>
    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
  </div>
);

export default PageHeader;
