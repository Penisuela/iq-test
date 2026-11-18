import type { Metadata } from "next";

export const metadata: Metadata = { title: "Отмена подписки — Mindmark" };

export default function CancelLayout({ children }: LayoutProps<"/cancel">) {
  return children;
}
