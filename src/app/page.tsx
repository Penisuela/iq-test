import Link from "next/link";
import { PLANS } from "../../convex/lib/plans";
import { BellCurve } from "@/components/BellCurve";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { TrackEvent } from "@/components/TrackEvent";
import { buttonClass, Card, Header, ProgressBar } from "@/components/ui";

const STEPS = [
  {
    title: "Пройдите тест",
    text: "20 вопросов с нарастающей сложностью. Регистрация не нужна.",
  },
  {
    title: "Откройте результат",
    text: "Балл IQ и ваше место среди других участников.",
  },
  {
    title: "Изучите разбор",
    text: "Сильные стороны по трём навыкам мышления.",
  },
];

const SKILLS = [
  { title: "Логика", text: "Выводы из условий и задачи с подвохом.", value: 86 },
  { title: "Числа", text: "Закономерности в числовых рядах.", value: 71 },
  { title: "Вербальное мышление", text: "Аналогии и связи между понятиями.", value: 67 },
];

const FAQ = [
  {
    q: "Насколько точен результат?",
    a: "Это ориентировочная оценка по короткому тесту. Она показывает ваш уровень относительно других участников, но не заменяет очное тестирование у психолога.",
  },
  {
    q: "Тест бесплатный?",
    a: "Пройти тест можно бесплатно. Платный только доступ к результату и разбору — цена указана ниже и на экране оплаты до списания.",
  },
  {
    q: "Как отменить подписку?",
    a: "В один клик по ссылке из письма с результатом, в любой момент. Если подписка не нужна, выберите разовый тариф «Только результат».",
  },
];

function StartButton({ label = "Начать тест" }: { label?: string }) {
  return (
    <Link href="/quiz" className={buttonClass}>
      {label}
      <ArrowIcon />
    </Link>
  );
}

function SampleResult() {
  return (
    <Card className="relative shadow-[0_24px_60px_-30px_rgba(21,22,28,0.35)]">
      <span className="absolute right-5 top-5 rounded-full bg-highlight px-3 py-1 text-xs font-bold">
        Пример
      </span>
      <p className="text-sm font-semibold text-muted">Ваш IQ</p>
      <p className="text-6xl font-extrabold tracking-tight">124</p>
      <p className="mb-3 text-sm text-muted">Выше, чем у 95% участников</p>
      <BellCurve iq={124} />
    </Card>
  );
}

export default function LandingPage() {
  return (
    <>
      <TrackEvent name="landing_view" />
      <Header>
        <Link
          href="/quiz"
          className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold"
        >
          Начать
        </Link>
      </Header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 pb-16 pt-6 lg:gap-24 lg:pt-14">
        <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex animate-rise flex-col gap-5">
            <h1 className="text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Узнайте свой <span className="text-accent">уровень IQ</span> за 7 минут
            </h1>
            <p className="text-lg text-muted">
              Тест на логику, числа и вербальное мышление. В конце — балл IQ и разбор
              ваших сильных сторон.
            </p>
            <div className="sm:max-w-xs">
              <StartButton />
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted">
              {["20 вопросов", "Около 7 минут", "Без регистрации"].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckIcon className="size-4 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-rise [animation-delay:120ms]">
            <SampleResult />
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Как это работает</h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <Card className="h-full">
                  <span className="mb-4 grid size-9 place-items-center rounded-xl bg-accent-soft text-sm font-extrabold text-accent">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-1 text-muted">{step.text}</p>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight">Что вы узнаете</h2>
            <p className="text-lg text-muted">
              Не только общий балл, но и то, какие навыки мышления у вас развиты
              сильнее остальных.
            </p>
          </div>
          <Card>
            <ul className="flex flex-col gap-5">
              {SKILLS.map((skill) => (
                <li key={skill.title} className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-bold">{skill.title}</h3>
                    <span className="text-sm font-semibold text-muted">{skill.value}%</span>
                  </div>
                  <ProgressBar value={skill.value} />
                  <p className="text-sm text-muted">{skill.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-muted">Пример разбора. Ваши цифры будут другими.</p>
          </Card>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-extrabold tracking-tight">Честная цена</h2>
            <p className="text-lg text-muted">
              Тест бесплатный. Платный только результат — и условия видны заранее.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PLANS.map((plan) => (
              <Card key={plan.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-bold">{plan.title}</h3>
                  <span className="text-2xl font-extrabold">{plan.price} ₽</span>
                </div>
                <p className="mt-2 text-muted">{plan.terms}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 lg:gap-16">
          <h2 className="text-3xl font-extrabold tracking-tight">Вопросы и ответы</h2>
          <div className="flex flex-col gap-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-border bg-surface px-5 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="text-2xl font-medium leading-none text-muted transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center gap-5 rounded-[2rem] bg-foreground px-6 py-12 text-center text-white">
          <h2 className="max-w-md text-3xl font-extrabold tracking-tight">
            Готовы проверить себя?
          </h2>
          <p className="max-w-sm text-white/70">Семь минут — и вы узнаете свой результат.</p>
          <Link
            href="/quiz"
            className="inline-flex h-14 items-center gap-2 rounded-2xl bg-highlight px-8 text-base font-bold text-foreground transition active:scale-[0.98]"
          >
            Начать тест
            <ArrowIcon />
          </Link>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-5xl px-4 pb-10 text-xs text-muted">
        Mindmark — демонстрационный проект. Результат носит ознакомительный характер и не
        является медицинским или психологическим заключением.
      </footer>
    </>
  );
}
