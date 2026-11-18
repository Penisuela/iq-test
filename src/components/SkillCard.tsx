const R = 25;
const CIRCUMFERENCE = 2 * Math.PI * R;

function level(score: number): { label: string; className: string } {
  if (score >= 75) return { label: "Сильная сторона", className: "bg-highlight" };
  if (score >= 50) return { label: "Уверенный уровень", className: "bg-accent-soft text-accent" };
  return { label: "Есть куда расти", className: "bg-background text-muted" };
}

// Карточка навыка: круговая шкала с баллом из 100, уровень и пояснение.
export function SkillCard({
  title,
  score,
  text,
}: {
  title: string;
  score: number;
  text: string;
}) {
  const { label, className } = level(score);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
      <div className="relative size-16 shrink-0">
        <svg viewBox="0 0 60 60" className="size-full -rotate-90" aria-hidden>
          <circle cx="30" cy="30" r={R} fill="none" strokeWidth="5" className="stroke-border" />
          <circle
            cx="30"
            cy="30"
            r={R}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
            className="stroke-accent"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-xl font-extrabold tabular-nums">
          {score}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="font-bold">{title}</h3>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${className}`}>
            {label}
          </span>
        </div>
        <p className="text-sm text-muted">{text}</p>
      </div>
    </div>
  );
}
