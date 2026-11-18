import type { Metadata } from "next";
import { Header } from "@/components/ui";

export const metadata: Metadata = { title: "Документы — Mindmark" };

const DOCUMENTS = [
  {
    id: "privacy",
    title: "Политика конфиденциальности",
    text: "Сервис сохраняет ответы на вопросы теста, результат и email, указанный при оплате. Данные не передаются третьим лицам.",
  },
  {
    id: "offer",
    title: "Оферта",
    text: "Тест проходится бесплатно. Платным является доступ к результату и разбору . Цена и условия продления показываются до оплаты.",
  },
  {
    id: "terms",
    title: "Пользовательское соглашение",
    text: "Результат теста носит ознакомительный характер и не является медицинским или психологическим заключением.",
  },
  {
    id: "consent",
    title: "Согласие на обработку данных",
    text: "Указывая email, вы соглашаетесь на его использование для отправки результата и чека.",
  },
];

export default function LegalPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 pb-16 pt-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight">Документы</h1>
          <p className="text-muted">
            Mindmark — демонстрационный проект. Ниже краткие версии документов.
          </p>
        </div>
        {DOCUMENTS.map((doc) => (
          <section key={doc.id} id={doc.id} className="flex scroll-mt-6 flex-col gap-2">
            <h2 className="text-xl font-bold">{doc.title}</h2>
            <p className="text-muted">{doc.text}</p>
          </section>
        ))}
      </main>
    </>
  );
}
