import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ImagePlus, X } from "lucide-react";
import { COLORS, KINDS, onColor } from "../lib/kinds";
import { fileToCover } from "../lib/store";
import type { LiiistList } from "../lib/types";
import { Icon } from "./Icon";
import { IconPicker } from "./IconPicker";

export type ListDraft = Pick<LiiistList, "title" | "description" | "kind" | "color" | "icon" | "cover">;

export const emptyDraft: ListDraft = {
  title: "", description: "", kind: "anything", color: "#0a0a0b", icon: "Sparkles", cover: null,
};

export function ListEditor({
  initial, heading, submitLabel, onSubmit, onClose,
}: {
  initial: ListDraft; heading: string; submitLabel: string;
  onSubmit: (d: ListDraft) => void; onClose: () => void;
}) {
  const [d, setD] = useState(initial);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof ListDraft>(k: K, v: ListDraft[K]) => setD((p) => ({ ...p, [k]: v }));

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-end justify-items-center p-0 sm:place-items-center sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 backdrop-blur-md" style={{ background: "var(--scrim)" }} onClick={onClose} />
      <motion.form
        role="dialog" aria-modal="true" aria-label={heading}
        className="glass relative flex max-h-[92dvh] w-full max-w-xl flex-col gap-5 overflow-y-auto p-6 sm:p-7"
        initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 24, scale: 0.97, filter: "blur(6px)" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        onSubmit={(e) => { e.preventDefault(); if (d.title.trim()) onSubmit({ ...d, title: d.title.trim() }); }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">{heading}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={17} /></button>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            layout
            className="grid size-12 shrink-0 place-items-center rounded-2xl"
            style={{ background: d.color, color: onColor(d.color), boxShadow: "inset 0 0 0 1px var(--hairline)" }}
          >
            <Icon name={d.icon} size={22} />
          </motion.div>
          <input
            className="field" autoFocus placeholder="List title" value={d.title} maxLength={80}
            onChange={(e) => set("title", e.target.value)} aria-label="List title"
          />
        </div>

        <textarea
          className="field min-h-20 resize-none" placeholder="Description (optional)" value={d.description}
          maxLength={280} onChange={(e) => set("description", e.target.value)} aria-label="Description"
        />

        <Section label="What is it a list of?">
          <div className="flex flex-wrap gap-1.5">
            {KINDS.map((k) => (
              <button
                key={k.id} type="button" onClick={() => set("kind", k.id)} aria-pressed={d.kind === k.id}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                  d.kind === k.id ? "border-transparent bg-accent text-accent-fg" : "border-hairline text-muted hover:text-fg"
                }`}
              >
                <Icon name={k.icon} size={13} />{k.label}
              </button>
            ))}
          </div>
        </Section>

        <Section label="Color">
          <div className="flex flex-wrap items-center gap-2">
            {COLORS.map((c) => (
              <motion.button
                key={c} type="button" aria-label={`Color ${c}`} aria-pressed={d.color === c}
                whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.12 }}
                onClick={() => set("color", c)}
                className="size-7 cursor-pointer rounded-full"
                style={{
                  background: c,
                  boxShadow: `inset 0 0 0 1px var(--hairline)${d.color === c ? ", 0 0 0 2px var(--bg), 0 0 0 4px var(--fg)" : ""}`,
                }}
              />
            ))}
            <label className="relative size-7 cursor-pointer overflow-hidden rounded-full border border-hairline" title="Custom color">
              <span className="absolute inset-0" style={{ background: "conic-gradient(#ef4444,#eab308,#22c55e,#3b82f6,#a855f7,#ef4444)" }} />
              <input type="color" value={d.color} onChange={(e) => set("color", e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0" aria-label="Custom color" />
            </label>
          </div>
        </Section>

        <Section label="Icon"><IconPicker value={d.icon} onChange={(n) => set("icon", n)} /></Section>

        <Section label="Cover image">
          <input ref={fileRef} type="file" accept="image/*" hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) set("cover", await fileToCover(f).catch(() => null));
              e.target.value = "";
            }} />
          {d.cover ? (
            <div className="relative overflow-hidden rounded-2xl">
              <img src={d.cover} alt="Cover preview" className="h-32 w-full object-cover" />
              <button type="button" className="icon-btn absolute right-2 top-2 !size-8" onClick={() => set("cover", null)} aria-label="Remove cover">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button type="button" className="btn w-full !justify-center !rounded-2xl border-dashed py-5" onClick={() => fileRef.current?.click()}>
              <ImagePlus size={17} /> Add cover
            </button>
          )}
        </Section>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={!d.title.trim()}>{submitLabel}</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{label}</div>
      {children}
    </div>
  );
}
