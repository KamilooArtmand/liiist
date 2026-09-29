import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { getTheme, setTheme } from "../lib/store";

export function ThemeToggle() {
  const [theme, set] = useState(getTheme);
  const next = theme === "light" ? "dark" : "light";
  return (
    <motion.button
      className="icon-btn"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.06 }}
      aria-label={`Switch to ${next} theme`}
      onClick={() => { setTheme(next); set(next); }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25 }}
          className="grid"
        >
          {theme === "light" ? <Sun size={17} /> : <Moon size={17} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
