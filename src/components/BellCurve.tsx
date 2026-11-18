import { useId } from "react";

const W = 320;
const H = 132;
const BASE = 104;
const PEAK = 92;
const IQ_FROM = 55;
const IQ_TO = 145;

const xOf = (iq: number) => ((iq - IQ_FROM) / (IQ_TO - IQ_FROM)) * W;
const yOf = (iq: number) => BASE - PEAK * Math.exp(-(((iq - 100) / 15) ** 2) / 2);

const CURVE = Array.from({ length: 91 }, (_, i) => {
  const iq = IQ_FROM + i;
  return `${xOf(iq).toFixed(1)},${yOf(iq).toFixed(1)}`;
}).join(" L");
const LINE = `M${CURVE}`;
const AREA = `${LINE} L${W},${BASE} L0,${BASE} Z`;

// Кривая распределения IQ. Без `iq` рисуется закрытый вариант для paywall.
export function BellCurve({ iq }: { iq?: number }) {
  const clipId = useId();
  const marker = iq === undefined ? undefined : Math.min(IQ_TO - 3, Math.max(IQ_FROM + 3, iq));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label={
        iq === undefined
          ? "Кривая распределения IQ, ваш результат скрыт"
          : `Кривая распределения IQ, ваш результат ${iq}`
      }
    >
      <path d={AREA} className="fill-border/60" />
      {marker !== undefined && (
        <>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={xOf(marker)} height={H} />
          </clipPath>
          <path d={AREA} clipPath={`url(#${clipId})`} className="fill-accent/25" />
        </>
      )}
      <path d={LINE} fill="none" strokeWidth="2.5" className="stroke-accent" />
      <line x1="0" x2={W} y1={BASE} y2={BASE} strokeWidth="1.5" className="stroke-border" />

      {[70, 85, 100, 115, 130].map((tick) => (
        <text
          key={tick}
          x={xOf(tick)}
          y={H - 8}
          textAnchor="middle"
          className="fill-muted text-[11px] font-medium"
        >
          {tick}
        </text>
      ))}

      {marker !== undefined && (
        <>
          <line
            x1={xOf(marker)}
            x2={xOf(marker)}
            y1={yOf(marker)}
            y2={BASE}
            strokeWidth="2.5"
            className="stroke-accent"
          />
          <circle
            cx={xOf(marker)}
            cy={yOf(marker)}
            r="6"
            strokeWidth="3"
            className="fill-surface stroke-accent"
          />
        </>
      )}
    </svg>
  );
}
