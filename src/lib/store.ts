import { useSyncExternalStore } from "react";
import type { Comment, LiiistList, ListItem } from "./types";

const DATA_KEY = "liiist:lists";
const AUTH_KEY = "liiist:session";
const THEME_KEY = "liiist:theme";

const USERNAME = "Kamiloo";
const PASSWORD = "Kamiloo";

/** Short unique id, e.g. "k3v9x2ab7q". */
export function uid(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => (b % 36).toString(36)).join("");
}

const seed = (): LiiistList[] => [
  {
    id: uid(), title: "Books that changed my mind", kind: "books", color: "#0a0a0b", icon: "BookOpen",
    description: "A short shelf of reads worth your evening.", cover: null, likes: 12, liked: false,
    views: 128, createdAt: Date.now() - 864e5 * 3, comments: [],
    items: [
      { id: uid(), title: "The Design of Everyday Things", note: "Don Norman", url: "" },
      { id: uid(), title: "Thinking, Fast and Slow", note: "Daniel Kahneman", url: "" },
    ],
  },
  {
    id: uid(), title: "Cities to live in someday", kind: "cities", color: "#3b82f6", icon: "Building2",
    description: "Quiet streets, good coffee, fast trains.", cover: null, likes: 8, liked: false,
    views: 64, createdAt: Date.now() - 864e5, comments: [],
    items: [
      { id: uid(), title: "Lisbon", note: "Light and hills", url: "" },
      { id: uid(), title: "Kyoto", note: "Spring, always", url: "" },
    ],
  },
];

function load(): LiiistList[] {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) return JSON.parse(raw) as LiiistList[];
  } catch { /* fall through to seed */ }
  return seed();
}

let lists: LiiistList[] = load();
let authed = (() => {
  try { return localStorage.getItem(AUTH_KEY) === USERNAME; } catch { return false; }
})();
const listeners = new Set<() => void>();

function commit(next: LiiistList[]) {
  lists = next;
  try { localStorage.setItem(DATA_KEY, JSON.stringify(lists)); } catch { /* quota */ }
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => (listeners.add(l), () => void listeners.delete(l));

export const useLists = () => useSyncExternalStore(subscribe, () => lists);
export const useList = (id: string | undefined) =>
  useSyncExternalStore(subscribe, () => lists.find((l) => l.id === id));
export const useAuthed = () => useSyncExternalStore(subscribe, () => authed);

const patch = (id: string, fn: (l: LiiistList) => LiiistList) =>
  commit(lists.map((l) => (l.id === id ? fn(l) : l)));

export const actions = {
  login(username: string, password: string): boolean {
    if (username !== USERNAME || password !== PASSWORD) return false;
    authed = true;
    try { localStorage.setItem(AUTH_KEY, USERNAME); } catch { /* ignore */ }
    listeners.forEach((l) => l());
    return true;
  },
  logout() {
    authed = false;
    try { localStorage.removeItem(AUTH_KEY); } catch { /* ignore */ }
    listeners.forEach((l) => l());
  },
  create(data: Pick<LiiistList, "title" | "description" | "kind" | "color" | "icon" | "cover">): string {
    const list: LiiistList = {
      ...data, id: uid(), items: [], likes: 0, liked: false, comments: [], views: 0, createdAt: Date.now(),
    };
    commit([list, ...lists]);
    return list.id;
  },
  update: (id: string, data: Partial<LiiistList>) => patch(id, (l) => ({ ...l, ...data, id: l.id })),
  remove: (id: string) => commit(lists.filter((l) => l.id !== id)),
  addItem: (id: string, item: Omit<ListItem, "id">) =>
    patch(id, (l) => ({ ...l, items: [...l.items, { ...item, id: uid() }] })),
  removeItem: (id: string, itemId: string) =>
    patch(id, (l) => ({ ...l, items: l.items.filter((i) => i.id !== itemId) })),
  toggleLike: (id: string) =>
    patch(id, (l) => ({ ...l, liked: !l.liked, likes: l.likes + (l.liked ? -1 : 1) })),
  addComment: (id: string, text: string) =>
    patch(id, (l) => {
      const c: Comment = { id: uid(), author: USERNAME, text, at: Date.now() };
      return { ...l, comments: [...l.comments, c] };
    }),
  /** Counts one view per list per browser session. */
  view(id: string) {
    const key = `liiist:viewed:${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch { /* count anyway */ }
    patch(id, (l) => ({ ...l, views: l.views + 1 }));
  },
};

export function getTheme(): "light" | "dark" {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
export function setTheme(t: "light" | "dark") {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(THEME_KEY, t); } catch { /* ignore */ }
}

/** Downscale an image file to a JPEG data URL small enough for localStorage. */
export async function fileToCover(file: File, maxW = 1200): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxW / bmp.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.8);
}
