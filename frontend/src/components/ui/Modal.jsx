import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/classNames.js";

const Modal = ({ open, onClose, title, description, children, className }) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-surface-950/80 px-4 py-10 backdrop-blur-md">
      <button
        aria-label="Close modal"
        className="absolute inset-0"
        onClick={onClose}
        type="button"
      />

      <div
        className={cn(
          "relative z-[71] w-full max-w-4xl rounded-[32px] border border-white/10 bg-surface-900/96 shadow-panel",
          className,
        )}
      >
        {(title || description) && (
          <div className="border-b border-white/8 px-6 py-5">
            {title ? <h2 className="text-xl font-semibold text-white">{title}</h2> : null}
            {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
