import { cn } from "../../utils/classNames.js";

const SplitLayout = ({
  left,
  right,
  bottom = null,
  className,
  leftClassName,
  rightClassName,
}) => (
  <div className={cn("space-y-6", className)}>
    <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
      <div className={cn("min-w-0", leftClassName)}>{left}</div>
      <div className={cn("min-w-0", rightClassName)}>{right}</div>
    </div>
    {bottom ? <div>{bottom}</div> : null}
  </div>
);

export default SplitLayout;
