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
          <rect
            width={CELL}
            height={CELL}
            rx="16"
            className={cell ? "fill-background" : "fill-highlight"}
          />
          {cell ? (
            <FigureShapes cell={cell} />
          ) : (
            <text
              x="32"
              y="43"
              textAnchor="middle"
              className="fill-foreground text-[30px] font-extrabold"
            >
              ?
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

const c = (shape: FigureCell["shape"], fill: FigureCell["fill"]): FigureCell => ({
  shape,
  fill,
  count: 1,
  rotation: 0,
});

// Пример для лендинга: совпадает с первым заданием-матрицей в тесте.
export const EXAMPLE_MATRIX: (FigureCell | null)[] = [
  c("circle", "outline"), c("circle", "tint"), c("circle", "solid"),
  c("square", "outline"), c("square", "tint"), c("square", "solid"),
  c("triangle", "outline"), c("triangle", "tint"), null,
];
