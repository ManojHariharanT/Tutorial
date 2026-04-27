const SurfaceCard = ({ as: Component = "article", className = "", ...props }) => (
  <Component className={`lp-card ${className}`.trim()} {...props} />
);

export default SurfaceCard;
