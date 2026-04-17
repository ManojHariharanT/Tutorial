import { createContext, useContext, useMemo, useState } from "react";
import { cn } from "../../utils/classNames.js";

const TabsContext = createContext(null);

const Tabs = ({ defaultValue, value, onValueChange, className, children }) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  const contextValue = useMemo(
    () => ({
      value: activeValue,
      onChange: (nextValue) => {
        if (!isControlled) {
          setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
    }),
    [activeValue, isControlled, onValueChange],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, ...props }) => (
  <div
    className={cn(
      "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5",
      className,
    )}
    {...props}
  />
);

export const TabsTrigger = ({ value, className, children, ...props }) => {
  const context = useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      className={cn(
        "rounded-xl px-3 py-2 text-sm font-medium transition duration-200",
        isActive ? "bg-white text-surface-950 shadow-soft" : "text-slate-300 hover:bg-white/8",
        className,
      )}
      onClick={() => context?.onChange(value)}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsPanel = ({ value, className, children, ...props }) => {
  const context = useContext(TabsContext);

  if (context?.value !== value) {
    return null;
  }

  return (
    <div className={cn("animate-fade-in-up", className)} {...props}>
      {children}
    </div>
  );
};

export default Tabs;
