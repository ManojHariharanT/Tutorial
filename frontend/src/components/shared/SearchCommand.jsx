import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../ui/Modal.jsx";
import Input from "../ui/Input.jsx";
import { cn } from "../../utils/classNames.js";

const SearchCommand = ({ open, onClose, items = [] }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) {
      return items.slice(0, 10);
    }

    const normalized = query.toLowerCase();
    return items.filter((item) =>
      [item.label, item.description, ...(item.keywords || [])]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [items, query]);

  const handleSelect = (item) => {
    onClose?.();
    setQuery("");

    if (item.action) {
      item.action();
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <Modal
      className="max-w-3xl"
      description="Jump to routes, tutorials, problems, and tools from anywhere in the workspace."
      onClose={onClose}
      open={open}
      title="Command Palette"
    >
      <div className="space-y-4">
        <Input
          autoFocus
          icon={<span className="text-sm">/</span>}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the workspace"
          value={query}
        />

        <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          {results.length ? (
            results.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex w-full items-start justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-left transition duration-200 hover:border-white/12 hover:bg-white/7",
                )}
                onClick={() => handleSelect(item)}
                type="button"
              >
                <div>
                  <p className="font-medium text-white">{item.label}</p>
                  {item.description ? (
                    <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                  ) : null}
                </div>
                {item.shortcut ? (
                  <span className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-500">
                    {item.shortcut}
                  </span>
                ) : null}
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-slate-500">
              No results matched this search.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SearchCommand;
