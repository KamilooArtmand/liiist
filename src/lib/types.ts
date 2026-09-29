export type Kind =
  | "products" | "books" | "apps" | "links" | "people" | "brands"
  | "cities" | "places" | "businesses" | "movies" | "anything";

export interface ListItem {
  id: string;
  title: string;
  note: string;
  url: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  at: number;
}

export interface LiiistList {
  id: string;
  title: string;
  description: string;
  kind: Kind;
  color: string;
  icon: string;
  cover: string | null;
  items: ListItem[];
  likes: number;
  liked: boolean;
  comments: Comment[];
  views: number;
  createdAt: number;
}
