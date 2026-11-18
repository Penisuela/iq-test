import { type FigureCell, FigureShapes } from "@/components/Figure";

const CELL = 64;
const GAP = 12;
const SIZE = CELL * 3 + GAP * 2;

// Таблица 3×3 из фигур; null — пропущенная клетка со знаком вопроса.
export function Matrix({ cells }: { cells: (FigureCell | null)[] }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full"
      role="img"
      aria-label="Таблица фигур три на три, одна клетка пропущена"
    >
      {cells.map((cell, i) => (
        <g
          key={i}
          transform={`translate(${(i % 3) * (CELL + GAP)} ${Math.floor(i / 3) * (CELL + GAP)})`}
        >
          {cell ? (
            <rect width={CELL} height={CELL} rx="16" className="fill-background" />
          ) : (
            // Пропущенная клетка: пунктирная рамка без заливки, чтобы цвет не подсказывал ответ.
            <rect
              x="1.5"
              y="1.5"
              width={CELL - 3}
              height={CELL - 3}
              rx="15"
              strokeWidth="3"
              strokeDasharray="7 6"
              className="fill-surface stroke-accent"
            />
          )}
          {cell ? (
            <FigureShapes cell={cell} />
          ) : (
            <text
              x="32"
              y="43"
              textAnchor="middle"
              className="fill-accent text-[30px] font-extrabold"
            >
              ?
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
