import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, ExternalLink, Eye, Fingerprint, Heart, MessageCircle, Pencil, Plus, Send, Share2, Trash2 } from "lucide-react";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
import { ListEditor } from "../components/ListEditor";
import { kindOf, onColor } from "../lib/kinds";
import { actions, useList } from "../lib/store";

const spring = { type: "spring", stiffness: 380, damping: 30 } as const;

export default function ListPage() {
  const { id } = useParams();
  const list = useList(id);
  const nav = useNavigate();
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => { if (id) actions.view(id); }, [id]);

  if (!list) return <Navigate to="/" replace />;
  const noun = kindOf(list.kind).noun;
  const fg = onColor(list.color);

  async function share() {
    const link = location.href;
    if (navigator.share) {
      try { await navigator.share({ title: list!.title, url: link }); return; } catch { /* cancelled */ }
    }
    try { await navigator.clipboard.writeText(link); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <Header />
      <motion.main className="mx-auto w-full max-w-3xl px-4 pb-24"
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg">
          <ArrowLeft size={15} /> All lists
        </Link>

        <section className="glass overflow-hidden">
          <div className="h-44 sm:h-56" style={list.cover ? undefined : { background: `linear-gradient(135deg, ${list.color}, color-mix(in oklab, ${list.color} 35%, transparent))` }}>
            {list.cover && <img src={list.cover} alt="" className="size-full object-cover" />}
          </div>
          <div className="p-6 sm:p-8">
            <motion.div layoutId={`icon-${list.id}`} className="-mt-14 mb-4 grid size-14 place-items-center rounded-2xl"
              style={{ background: list.color, color: fg, boxShadow: "0 0 0 4px var(--glass-strong)" }}>
              <Icon name={list.icon} size={26} />
            </motion.div>
            <h1 className="text-3xl font-semibold tracking-tight">{list.title}</h1>
            {list.description && <p className="mt-2 text-muted">{list.description}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5" title="Unique list ID"><Fingerprint size={15} /><code className="font-mono text-xs">{list.id}</code></span>
              <span className="inline-flex items-center gap-1.5" title="Views"><Eye size={15} />
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={list.views} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}>{list.views}</motion.span>
                </AnimatePresence> views
              </span>
              <span>{kindOf(list.kind).label}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <motion.button className="btn" whileTap={{ scale: 0.92 }} onClick={() => actions.toggleLike(list.id)} aria-pressed={list.liked}>
                <motion.span animate={{ scale: list.liked ? [1, 1.5, 1] : 1 }} transition={{ duration: 0.4 }} className="grid">
                  <Heart size={16} fill={list.liked ? "currentColor" : "none"} />
                </motion.span>
                {list.likes}
              </motion.button>
              <motion.button className="btn" whileTap={{ scale: 0.95 }} onClick={share}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={String(copied)} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} className="inline-flex items-center gap-2">
                    {copied ? <><Check size={16} /> Link copied</> : <><Share2 size={16} /> Share</>}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
              <button className="btn" onClick={() => setEditing(true)}><Pencil size={15} /> Edit</button>
              <button className="btn" onClick={() => { if (confirm("Delete this list?")) { actions.remove(list.id); nav("/"); } }}>
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        </section>

        <h2 className="mb-3 mt-10 text-sm font-medium uppercase tracking-wider text-muted">Items · {list.items.length}</h2>
        <form className="glass mb-3 flex flex-col gap-2 p-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            actions.addItem(list.id, { title: title.trim(), note: note.trim(), url: url.trim() });
            setTitle(""); setNote(""); setUrl("");
          }}>
          <input className="field sm:flex-[2]" placeholder={`Add a ${noun}`} value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Item title" />
          <input className="field sm:flex-[2]" placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Item note" />
          <input className="field sm:flex-[2]" placeholder="Link (optional)" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Item link" />
          <motion.button className="btn btn-primary" whileTap={{ scale: 0.94 }} disabled={!title.trim()}><Plus size={16} /> Add</motion.button>
        </form>

        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {list.items.map((it, i) => (
              <motion.li key={it.id} layout
                initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.96 }} transition={{ ...spring, delay: Math.min(i * 0.03, 0.3) }}
                className="glass flex items-center gap-3 !rounded-2xl px-4 py-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl text-xs font-semibold" style={{ background: list.color, color: fg }}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{it.title}</div>
                  {it.note && <div className="truncate text-sm text-muted">{it.note}</div>}
                </div>
                {it.url && (
                  <a className="icon-btn !size-8" href={/^https?:\/\//.test(it.url) ? it.url : `https://${it.url}`} target="_blank" rel="noreferrer noopener" aria-label="Open link">
                    <ExternalLink size={14} />
                  </a>
                )}
                <button className="icon-btn !size-8" onClick={() => actions.removeItem(list.id, it.id)} aria-label="Remove item"><Trash2 size={14} /></button>
              </motion.li>
            ))}
          </AnimatePresence>
          {list.items.length === 0 && <li className="p-6 text-center text-sm text-muted">No items yet.</li>}
        </ul>

        <h2 className="mb-3 mt-10 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted">
          <MessageCircle size={14} /> Comments · {list.comments.length}
        </h2>
        <form className="glass mb-3 flex gap-2 p-3" onSubmit={(e) => { e.preventDefault(); if (comment.trim()) { actions.addComment(list.id, comment.trim()); setComment(""); } }}>
          <input className="field" placeholder="Write a comment" value={comment} onChange={(e) => setComment(e.target.value)} aria-label="Comment" />
          <motion.button className="btn btn-primary" whileTap={{ scale: 0.94 }} disabled={!comment.trim()} aria-label="Send comment"><Send size={16} /></motion.button>
        </form>
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {list.comments.map((c) => (
              <motion.li key={c.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="glass !rounded-2xl px-4 py-3">
                <div className="flex items-baseline justify-between text-xs text-muted">
                  <span className="font-semibold text-fg">{c.author}</span>
                  <time>{new Date(c.at).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}</time>
                </div>
                <p className="mt-1 text-sm">{c.text}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.main>

      <AnimatePresence>
        {editing && (
          <ListEditor
            initial={{ title: list.title, description: list.description, kind: list.kind, color: list.color, icon: list.icon, cover: list.cover }}
            heading="Edit list" submitLabel="Save"
            onClose={() => setEditing(false)}
            onSubmit={(d) => { actions.update(list.id, d); setEditing(false); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
