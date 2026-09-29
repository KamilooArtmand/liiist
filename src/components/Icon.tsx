import { icons, type LucideProps } from "lucide-react";

export const ICON_NAMES = Object.keys(icons);

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = icons[name as keyof typeof icons] ?? icons.List;
  return <Cmp {...props} />;
}
