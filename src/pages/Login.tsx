import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ListChecks } from "lucide-react";
import { actions } from "../lib/store";

export default function Login() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(0);

  return (
    <div className="grid min-h-dvh place-items-center p-6">
      <motion.form
        className="glass w-full max-w-sm p-8"
        initial={{ opacity: 0, y: 30, scale: 0.96, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!actions.login(u, p)) { setError(true); setShake((s) => s + 1); }
        }}
      >
        <motion.div
          className="mb-6 grid size-12 place-items-center rounded-2xl bg-accent text-accent-fg"
          initial={{ rotate: -20, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 }}
        >
          <ListChecks size={24} />
        </motion.div>
        <h1 className="text-2xl font-semibold tracking-tight">Liiist</h1>
        <p className="mb-6 mt-1 text-sm text-muted">Make a list of anything.</p>

        <motion.div key={shake} animate={shake ? { x: [0, -10, 9, -6, 3, 0] } : {}} transition={{ duration: 0.45 }} className="flex flex-col gap-3">
          <input className="field" placeholder="Username" autoComplete="username" autoFocus value={u}
            onChange={(e) => { setU(e.target.value); setError(false); }} aria-label="Username" />
          <input className="field" type="password" placeholder="Password" autoComplete="current-password" value={p}
            onChange={(e) => { setP(e.target.value); setError(false); }} aria-label="Password" />
        </motion.div>

        <motion.p role="alert" className="mt-3 h-5 text-sm text-muted"
          animate={{ opacity: error ? 1 : 0, y: error ? 0 : -4 }}>
          Incorrect username or password.
        </motion.p>

        <motion.button className="btn btn-primary mt-2 w-full" whileTap={{ scale: 0.97 }} type="submit">
          Sign in <ArrowRight size={16} />
        </motion.button>
      </motion.form>
    </div>
  );
}
