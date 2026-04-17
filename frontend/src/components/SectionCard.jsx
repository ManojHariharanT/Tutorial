const SectionCard = ({ title, description, children, className = "" }) => (
  <section className={`surface-card p-6 ${className}`.trim()}>
    {(title || description) && (
      <div className="mb-5">
        {title ? <h2 className="text-lg font-semibold text-white">{title}</h2> : null}
        {description ? <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p> : null}
      </div>
    )}
    {children}
  </section>
);

export default SectionCard;
