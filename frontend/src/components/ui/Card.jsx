import { cn } from "../../utils/classNames.js";

export const Card = ({ as: Component = "section", className, ...props }) => (
  <Component
    className={cn(
      "rounded-[28px] border border-white/10 bg-surface-900/84 shadow-panel backdrop-blur-xl",
      className,
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col gap-2 p-6 pb-0", className)} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
  <h2 className={cn("text-xl font-semibold text-white", className)} {...props} />
);

export const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm leading-6 text-slate-400", className)} {...props} />
);

export const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6", className)} {...props} />
);

export const CardFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-wrap items-center gap-3 p-6 pt-0", className)} {...props} />
);

export default Card;
