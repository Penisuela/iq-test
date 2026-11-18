import Image from "next/image";
import type { ReactNode } from "react";
import advantagesImage from "../../public/images/advantages.png";
import ctaImage from "../../public/images/cta.png";
import heroImage from "../../public/images/hero.png";
import { OFFER } from "../../convex/lib/offer";
import { type Cell, QUESTIONS } from "../../convex/lib/questionBank";
import { FaqItem } from "@/components/FaqItem";
import { Footer } from "@/components/Footer";
import { CheckIcon } from "@/components/icons";
import { SkillCard } from "@/components/SkillCard";
import { StartLink } from "@/components/StartLink";
import { StickyStart } from "@/components/StickyStart";
import { TrackEvent } from "@/components/TrackEvent";
import { TryTask } from "@/components/TryTask";
import { buttonClass, Header } from "@/components/ui";

// Первое задание теста для блока на главной. Правильный ответ в браузер не передаётся.
const firstQuestion = QUESTIONS[0];
const FIRST_TASK = {
  id: firstQuestion.id,
  matrix: firstQuestion.matrix ?? [],
  options: firstQuestion.options.filter((o): o is Cell => typeof o !== "string"),
};

const NAV = [
  { href: "#advantages", label: "Преимущества" },
  { href: "#tasks", label: "Задание" },
  { href: "#faq", label: "FAQ" },
];

const ADVANTAGES = [
  {
    title: "7 минут",
    text: "Тест короткий: 20 вопросов без лишних анкет и ожидания.",
  },
  {
    title: "Без регистрации",
    text: "Начинаете сразу. Email понадобится только на шаге оплаты.",
  },
  {
    title: "Понятные условия",
    text: "Цена видна до оплаты, а подписка отменяется по email за минуту.",
  },
];

const SKILLS = [
  { title: "Логика", text: "Закономерности в фигурах и задачи с подвохом.", value: 86 },
  { title: "Числа", text: "Закономерности в числовых рядах.", value: 68 },
  { title: "Вербальное мышление", text: "Аналогии и связи между понятиями.", value: 47 },
];

// Пять самых частых вопросов: набор собран по FAQ конкурентов (IQMO, myIQ).
const FAQ = [
  {
    q: "Можно ли пройти тест бесплатно?",
    a: "Да. Тест открыт всем и не требует регистрации. Платным является только доступ к результату и разбору.",
  },
  {
    q: "Сколько стоит доступ к результату?",
    a: `${OFFER.terms} Цена и условия ещё раз показываются на экране оплаты до списания.`,
  },
  {
    q: "Что я получу после оплаты?",
    a: "Балл IQ по шкале со средним 100, ваше место среди других участников, разбор по трём навыкам мышления и пояснение, что значит результат.",
  },
  {
    q: "Насколько точен результат?",
    a: "Это ориентировочная оценка по короткому тесту. Она показывает ваш уровень относительно других участников, но не заменяет очное тестирование у психолога.",
  },
  {
    q: "Как отменить подписку?",
    a: "В любой момент на странице «Отменить подписку» внизу сайта: достаточно указать email, на который она оформлена. Доступ сохранится до конца оплаченного периода.",
  },
];

// Единый стиль блоков: лавандовая панель, внутри заголовок и белые карточки.
function Panel({
  id,
  title,
  sub,
  children,
}: {
  id?: string;
  title: string;
  sub?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="flex scroll-mt-20 flex-col gap-6 rounded-[2rem] bg-accent-soft p-5 sm:gap-8 sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {sub && <p className="max-w-xl text-lg text-muted">{sub}</p>}
      </div>
      {children}
    </section>
  );
}


function HeroVisual() {
  return (
    <div className="mx-auto w-full max-w-lg animate-rise [animation-delay:120ms]">
      <Image
        src={heroImage}
        alt="Человек за ноутбуком решает задание с фигурами"
        sizes="(min-width: 1024px) 512px, 92vw"
        priority
        className="h-auto w-full"
      />
    </div>
  );
}

function Advantages() {
  return (
    <div className="grid items-center gap-6 lg:grid-cols-[2fr_3fr] lg:gap-10">
      <Image
        src={advantagesImage}
        alt="Тест на экране телефона"
        sizes="(min-width: 1024px) 380px, 320px"
        className="mx-auto h-auto w-full max-w-xs lg:max-w-none"
      />
      <ul className="flex flex-col gap-7">
        {ADVANTAGES.map(({ title, text }) => (
          <li key={title} className="flex gap-3">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent text-white">
              <CheckIcon className="size-4" />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-extrabold">{title}</h3>
              <p className="text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
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
      </Header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 overflow-x-clip px-4 pb-16 pt-6 lg:gap-8 lg:pt-10">
        <section className="grid items-center gap-10 pb-6 lg:grid-cols-2 lg:pb-10">
          <div className="flex animate-rise flex-col gap-6">
            <h1 className="font-display text-[2rem] font-bold leading-[1.12] tracking-tight sm:text-5xl sm:leading-[1.1]">
              Узнайте свой уровень IQ{" "}
              <span className="relative whitespace-nowrap">
                <span className="absolute inset-x-0 bottom-1 h-3 rounded-full bg-highlight sm:h-4" />
                <span className="relative">за 7 минут</span>
              </span>
            </h1>
            <p className="text-lg text-muted">
              20 вопросов на логику, числа и вербальное мышление — около 7 минут и без
              регистрации. В конце — балл IQ и разбор ваших сильных сторон.
            </p>
            <div id="hero-cta" className="sm:max-w-xs">
              <StartLink source="hero" className={buttonClass}>
                Начать тест
              </StartLink>
            </div>
          </div>
          <HeroVisual />
        </section>

        <Panel
          title="Что вы узнаете"
          sub="Не только общий балл, но и то, какие навыки мышления у вас развиты сильнее остальных."
        >
          <div className="grid gap-3 lg:grid-cols-3">
            {SKILLS.map((skill) => (
              <SkillCard
                key={skill.title}
                title={skill.title}
                score={skill.value}
                text={skill.text}
                stacked
              />
            ))}
          </div>
        </Panel>

        <Panel id="advantages" title="Наши преимущества">
          <Advantages />
        </Panel>

        <Panel
          id="tasks"
          title="Попробуйте первое задание"
          sub="Проверьте себя прямо сейчас: это первый вопрос теста."
        >
          <TryTask
            questionId={FIRST_TASK.id}
            matrix={FIRST_TASK.matrix}
            options={FIRST_TASK.options}
          />
        </Panel>

        <Panel id="faq" title="Вопросы и ответы">
          <div className="flex flex-col gap-3">
            {FAQ.map((item, i) => (
              <FaqItem key={item.q} index={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </Panel>

        <section
          id="final-cta"
          className="grid items-center gap-6 rounded-[2rem] bg-accent-soft p-5 sm:p-8 md:grid-cols-[1fr_auto] md:gap-10 lg:px-10 lg:py-8"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Готовы проверить себя?
              </h2>
              <p className="text-lg text-muted">Семь минут — и вы узнаете свой результат.</p>
            </div>
            <div className="sm:max-w-xs">
              <StartLink source="final" className={buttonClass}>
                Начать тест
              </StartLink>
            </div>
          </div>
          <Image
            src={ctaImage}
            alt="Человек радуется результату теста"
            sizes="220px"
            className="hidden h-auto w-52 md:block"
          />
        </section>
      </main>

      <Footer />
      <StickyStart />
    </>
  );
}
