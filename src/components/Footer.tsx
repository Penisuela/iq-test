import Link from "next/link";
import { OverscrollTint } from "@/components/OverscrollTint";

const COLUMNS = [
  {
    title: "Организация",
    items: [{ label: "ООО «Майндмарк»" }, { label: "ИНН: 0000000000" }],
  },
  {
    title: "Контакты",
    items: [{ label: "support@mindmark.example" }],
  },
  {
    title: "Документы",
    items: [
      { label: "Политика конфиденциальности", href: "/legal/privacy" },
      { label: "Оферта", href: "/legal/offer" },
      { label: "Пользовательское соглашение", href: "/legal/terms" },
      { label: "Согласие на обработку данных", href: "/legal/consent" },
    ],
  },
  {
    title: "Информация",
    items: [{ label: "Отменить подписку", href: "/cancel" }],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-foreground text-white">
      <OverscrollTint />
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((column) => (
          <div key={column.title} className="flex flex-col gap-2">
            <h3 className="font-bold">{column.title}</h3>
            <ul className="flex flex-col text-sm text-white/60">
              {column.items.map((item) => (
                <li key={item.label} className="py-1">
                  {"href" in item && item.href ? (
                    <Link href={item.href} className="-my-1 inline-block py-2 transition hover:text-white">
                      {item.label}
                    </Link>
                  ) : (
                    item.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-5xl px-4 py-6 text-sm text-white/60">
          © 2026 Mindmark. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
