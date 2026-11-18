import { LogicIcon, NumbersIcon, VerbalIcon } from "@/components/icons";

const ICONS = {
  Логика: LogicIcon,
  Числа: NumbersIcon,
  "Вербальное мышление": VerbalIcon,
} as const;

export function CategoryIcon({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const Icon = ICONS[category as keyof typeof ICONS] ?? LogicIcon;
  return <Icon className={className} />;
}
