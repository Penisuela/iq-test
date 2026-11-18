import Link from "next/link";

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
      { label: "Политика конфиденциальности", href: "/legal#privacy" },
      { label: "Оферта", href: "/legal#offer" },
      { label: "Пользовательское соглашение", href: "/legal#terms" },
      { label: "Согласие на обработку данных", href: "/legal#consent" },
    ],
  },
  {
    title: "Информация",
    items: [{ label: "Отменить подписку", href: "/#faq" }],
  },
];

const PAYMENT_METHODS = ["Мир", "Visa", "Mastercard", "СБП"];

export function Footer() {
  return (
    <footer className="mt-auto bg-foreground text-white">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((column) => (
          <div key={column.title} className="flex flex-col gap-2">
            <h2 className="font-bold">{column.title}</h2>
            <ul className="flex flex-col gap-1.5 text-sm text-white/60">
              {column.items.map((item) => (
                <li key={item.label}>
                  {"href" in item && item.href ? (
                    <Link href={item.href} className="transition hover:text-white">
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
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/60">© 2026 Mindmark. Все права защищены.</p>
          <ul className="flex flex-wrap gap-2" aria-label="Способы оплаты">
            {PAYMENT_METHODS.map((method) => (
              <li
                key={method}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
