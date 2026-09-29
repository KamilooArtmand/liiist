import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router";
import { AnimatePresence, MotionConfig } from "motion/react";
import { useAuthed } from "./lib/store";
import Home from "./pages/Home";
import ListPage from "./pages/ListPage";
import Login from "./pages/Login";

function AnimatedRoutes() {
  const location = useLocation();
  const authed = useAuthed();
  if (!authed) return <Login />;
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split("/")[1] || "home"}>
        <Route path="/" element={<Home />} />
        <Route path="/l/:id" element={<ListPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
      <div className="ambient" aria-hidden />
      <HashRouter>
        <AnimatedRoutes />
      </HashRouter>
    </MotionConfig>
  );
}
