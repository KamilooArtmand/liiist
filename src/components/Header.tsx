import { Link } from "react-router";
import { ListChecks, LogOut } from "lucide-react";
import { actions } from "../lib/store";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-3 z-30 mx-auto mb-8 flex w-full max-w-5xl items-center justify-between gap-3 px-4 pt-3">
      <Link to="/" className="glass flex items-center gap-2.5 !rounded-full py-2 pl-2.5 pr-4 text-sm font-semibold tracking-tight">
        <span className="grid size-7 place-items-center rounded-full bg-accent text-accent-fg"><ListChecks size={15} /></span>
        Liiist
      </Link>
      <div className="flex items-center gap-2">
        {children}
        <ThemeToggle />
        <button className="icon-btn" onClick={actions.logout} aria-label="Sign out"><LogOut size={16} /></button>
      </div>
    </header>
  );
}
