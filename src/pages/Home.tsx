import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Eye, Heart, MessageCircle, Plus } from "lucide-react";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
import { ListEditor, emptyDraft } from "../components/ListEditor";
import { kindOf, onColor } from "../lib/kinds";
import { actions, useLists } from "../lib/store";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
const rise = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Home() {
  const lists = useLists();
  const nav = useNavigate();
  const [creating, setCreating] = useState(false);

  return (
    <>
      <Header>
        <motion.button className="btn btn-primary" whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }} onClick={() => setCreating(true)}>
          <Plus size={16} /> New list
        </motion.button>
      </Header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.h1 variants={rise} className="text-4xl font-semibold tracking-tight sm:text-5xl">Your lists</motion.h1>
          <motion.p variants={rise} className="mb-8 mt-2 text-muted">Books, places, people, apps. Anything worth keeping.</motion.p>

          {lists.length === 0 ? (
            <motion.div variants={rise} className="glass p-12 text-center text-muted">Nothing here yet. Create your first list.</motion.div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lists.map((l) => (
                <motion.div key={l.id} variants={rise} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                  <Link to={`/l/${l.id}`} className="glass block overflow-hidden">
                    <div className="h-28 w-full" style={l.cover ? undefined : { background: `linear-gradient(135deg, ${l.color}, color-mix(in oklab, ${l.color} 40%, transparent))` }}>
                      {l.cover && <img src={l.cover} alt="" className="size-full object-cover" loading="lazy" />}
                    </div>
                    <div className="p-5">
                      <div className="-mt-11 mb-3 grid size-11 place-items-center rounded-2xl shadow-lg"
                        style={{ background: l.color, color: onColor(l.color), boxShadow: "0 0 0 3px var(--glass-strong)" }}>
                        <Icon name={l.icon} size={20} />
                      </div>
                      <h2 className="truncate font-semibold tracking-tight">{l.title}</h2>
                      <p className="mt-0.5 line-clamp-2 min-h-10 text-sm text-muted">{l.description || kindOf(l.kind).label}</p>
                      <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                        <span className="inline-flex items-center gap-1"><Eye size={13} />{l.views}</span>
                        <span className="inline-flex items-center gap-1"><Heart size={13} />{l.likes}</span>
                        <span className="inline-flex items-center gap-1"><MessageCircle size={13} />{l.comments.length}</span>
                        <span className="ml-auto">{l.items.length} items</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {creating && (
          <ListEditor
            initial={emptyDraft} heading="New list" submitLabel="Create"
            onClose={() => setCreating(false)}
            onSubmit={(d) => { const id = actions.create(d); setCreating(false); nav(`/l/${id}`); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
