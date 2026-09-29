import { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ICON_NAMES, Icon } from "./Icon";

const LIMIT = 150;

export function IconPicker({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q.trim().toLowerCase());
  const matches = useMemo(
    () => (dq ? ICON_NAMES.filter((n) => n.toLowerCase().includes(dq)) : ICON_NAMES),
    [dq],
  );

  return (
    <div>
      <div className="relative mb-2">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          className="field !pl-9"
          placeholder={`Search ${ICON_NAMES.length} icons`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search icons"
        />
      </div>
      <div className="grid max-h-44 grid-cols-7 gap-1 overflow-y-auto rounded-2xl border border-hairline p-1.5 sm:grid-cols-9">
        {matches.slice(0, LIMIT).map((n) => (
          <button
            key={n}
            type="button"
            title={n}
            aria-label={n}
            aria-pressed={n === value}
            onClick={() => onChange(n)}
            className={`grid aspect-square cursor-pointer place-items-center rounded-xl transition-colors duration-200 ${
              n === value ? "bg-accent text-accent-fg" : "text-muted hover:bg-field hover:text-fg"
            }`}
          >
            <Icon name={n} size={18} />
          </button>
        ))}
        {matches.length === 0 && <p className="col-span-full p-3 text-center text-sm text-muted">No icons found</p>}
      </div>
      {matches.length > LIMIT && (
        <p className="mt-1.5 text-xs text-subtle">Showing {LIMIT} of {matches.length}. Refine your search.</p>
      )}
    </div>
  );
}
