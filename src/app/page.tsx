import Link from "next/link";
import type { ReactNode } from "react";
import { BellCurve } from "@/components/BellCurve";
import { CategoryIcon } from "@/components/categoryIcon";
import { FaqItem } from "@/components/FaqItem";
import { Footer } from "@/components/Footer";
import { ArrowIcon, BoltIcon, ClockIcon, ListIcon } from "@/components/icons";
import { MatrixPuzzle } from "@/components/MatrixPuzzle";
import { SkillCard } from "@/components/SkillCard";
import { TrackEvent } from "@/components/TrackEvent";
import { buttonClass, Card, Header } from "@/components/ui";

const NAV = [
  { href: "#tasks", label: "Задания" },
  { href: "#how", label: "Как это работает" },
  { href: "#faq", label: "FAQ" },
];

const FACTS = [
  { icon: ListIcon, label: "20 вопросов" },
  { icon: ClockIcon, label: "Около 7 минут" },
  { icon: BoltIcon, label: "Без регистрации" },
];

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
  { title: "Числа", text: "Закономерности в числовых рядах.", value: 68 },
  { title: "Вербальное мышление", text: "Аналогии и связи между понятиями.", value: 47 },
];

const FAQ = [
  {
    q: "Насколько точен результат?",
    a: "Это ориентировочная оценка по короткому тесту. Она показывает ваш уровень относительно других участников, но не заменяет очное тестирование у психолога.",
  },
  {
    q: "Тест бесплатный?",
    a: "Пройти тест можно бесплатно. Платный только доступ к результату и разбору — цена и условия показаны после теста, до оплаты.",
  },
  {
    q: "Как отменить подписку?",
    a: "В один клик по ссылке из письма с результатом, в любой момент. Если подписка не нужна, выберите разовый тариф «Только результат».",
  },
];

function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{children}</h2>
      {sub && <p className="max-w-xl text-lg text-muted">{sub}</p>}
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md animate-rise [animation-delay:120ms]">
      {/* Декоративные фигуры */}
      <span className="absolute -right-3 top-6 size-28 rounded-full bg-highlight" />
      <span className="absolute -left-2 bottom-10 size-20 rotate-12 rounded-3xl bg-accent" />

      <div className="relative w-[62%] -rotate-3 rounded-3xl border border-border bg-surface p-4 shadow-[0_24px_60px_-30px_rgba(21,22,28,0.45)]">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
          Какой фигуры не хватает?
        </p>
        <MatrixPuzzle />
      </div>

      <div className="relative z-10 -mt-20 ml-auto w-[72%] rotate-2 rounded-3xl border border-border bg-surface p-4 shadow-[0_24px_60px_-30px_rgba(21,22,28,0.45)]">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-muted">Ваш IQ</p>
          <span className="rounded-full bg-highlight px-2.5 py-0.5 text-xs font-bold">
            Пример
          </span>
        </div>
        <p className="font-display text-4xl font-bold tracking-tight">124</p>
        <p className="mb-1 text-xs text-muted">Выше, чем у 95% участников</p>
        <BellCurve iq={124} />
      </div>

      <span className="absolute left-[52%] top-2 z-20 flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-white shadow-lg">
        <ClockIcon className="size-3.5 text-highlight" />
        6:42
      </span>
    </div>
  );
}

function TaskExamples() {
  const tile = "grid size-11 place-items-center rounded-xl text-lg font-extrabold";
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <Card className="flex flex-col gap-4">
        <CardLabel category="Логика" />
        <div className="mx-auto w-40">
          <MatrixPuzzle />
        </div>
        <p className="mt-auto text-muted">Найдите закономерность и недостающую фигуру.</p>
      </Card>

      <Card className="flex flex-col gap-4">
        <CardLabel category="Числа" />
        <div className="flex flex-1 flex-wrap items-center justify-center gap-2 py-6">
          {[2, 4, 8, 16].map((n) => (
            <span key={n} className={`${tile} bg-background`}>
              {n}
            </span>
          ))}
          <span className={`${tile} bg-highlight`}>?</span>
        </div>
        <p className="mt-auto text-muted">Продолжите числовой ряд.</p>
      </Card>

      <Card className="flex flex-col gap-4">
        <CardLabel category="Вербальное мышление" />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-lg font-extrabold">
          <span className="rounded-xl bg-background px-4 py-2">птица → гнездо</span>
          <span className="rounded-xl bg-accent-soft px-4 py-2 text-accent">
            пчела → <span className="rounded-md bg-highlight px-2 text-foreground">?</span>
          </span>
        </div>
        <p className="mt-auto text-muted">Подберите слово по аналогии.</p>
      </Card>
    </div>
  );
}

function CardLabel({ category }: { category: string }) {
  return (
    <span className="flex items-center gap-2 self-start rounded-full bg-accent-soft px-3 py-1 text-sm font-bold text-accent">
      <CategoryIcon category={category} className="size-4" />
      {category}
    </span>
  );
}

export default function LandingPage() {
  return (
    <>
      <TrackEvent name="landing_view" />
      <Header>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <Link
          href="/quiz"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-white transition hover:bg-black"
        >
          Начать
        </Link>
      </Header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-20 overflow-x-clip px-4 pb-20 pt-6 lg:gap-28 lg:pt-14">
        <section className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <div className="flex animate-rise flex-col gap-6">
            <h1 className="font-display text-[2rem] font-bold leading-[1.12] tracking-tight sm:text-5xl sm:leading-[1.1]">
              Узнайте свой{" "}
              <span className="relative whitespace-nowrap">
                <span className="absolute inset-x-0 bottom-1 h-3 rounded-full bg-highlight sm:h-4" />
                <span className="relative">уровень IQ</span>
              </span>{" "}
              за 7 минут
            </h1>
            <p className="text-lg text-muted">
              Задачи на логику, числа и вербальное мышление. В конце — балл IQ и разбор
              ваших сильных сторон.
            </p>
            <div className="sm:max-w-xs">
              <Link href="/quiz" className={buttonClass}>
                Начать тест
                <ArrowIcon />
              </Link>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {FACTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 text-sm font-medium text-muted"
                >
                  <Icon className="size-4 text-accent" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <HeroVisual />
        </section>

        <section id="tasks" className="flex scroll-mt-6 flex-col gap-8">
          <SectionTitle sub="Три типа заданий — от простых к сложным.">
            Какие будут задания
          </SectionTitle>
          <TaskExamples />
        </section>

        <section id="how" className="flex scroll-mt-6 flex-col gap-8">
          <SectionTitle>Как это работает</SectionTitle>
          <ol className="grid divide-y divide-border rounded-3xl border border-border bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-2 p-6 sm:p-8">
                <span className="mb-4 font-display text-4xl font-bold text-accent sm:mb-8">
                  0{i + 1}
                </span>
                <h3 className="text-xl font-extrabold">{step.title}</h3>
                <p className="text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-8">
          <SectionTitle sub="Не только общий балл, но и то, какие навыки мышления у вас развиты сильнее остальных.">
            Что вы узнаете
          </SectionTitle>
          <div className="rounded-[2rem] bg-accent-soft p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3 px-1">
              <p className="font-bold">Ваш профиль мышления</p>
              <span className="rounded-full bg-highlight px-2.5 py-0.5 text-xs font-bold">
                Пример
              </span>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              {SKILLS.map((skill) => (
                <SkillCard
                  key={skill.title}
                  title={skill.title}
                  score={skill.value}
                  text={skill.text}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="flex scroll-mt-6 flex-col gap-8">
          <SectionTitle>Вопросы и ответы</SectionTitle>
          <div>
            {FAQ.map((item, i) => (
              <FaqItem key={item.q} index={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </section>

        <section className="relative flex flex-col gap-6 overflow-hidden rounded-[2rem] bg-accent p-6 text-white sm:p-10 md:flex-row md:items-center md:justify-between md:gap-10">
          <span className="absolute -right-10 -top-16 size-40 rounded-full bg-white/10" />
          <div className="relative flex flex-col gap-2">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Готовы проверить себя?
            </h2>
            <p className="text-lg text-white/80">Семь минут — и вы узнаете свой результат.</p>
          </div>
          <Link
            href="/quiz"
            className="relative inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-highlight px-8 text-base font-bold text-foreground transition active:scale-[0.98]"
          >
            Начать тест
            <ArrowIcon />
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
