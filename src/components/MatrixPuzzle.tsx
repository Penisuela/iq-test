const CELL = 64;
const GAP = 12;
const SIZE = CELL * 3 + GAP * 2;

type Fill = "outline" | "tint" | "solid";
const FILLS: Fill[] = ["outline", "tint", "solid"];

const FILL_CLASS: Record<Fill, string> = {
  outline: "fill-none stroke-foreground",
  tint: "fill-accent/25 stroke-accent",
  solid: "fill-foreground stroke-foreground",
};

function Shape({ row, fill }: { row: number; fill: Fill }) {
  const props = { strokeWidth: 3, strokeLinejoin: "round" as const, className: FILL_CLASS[fill] };
  if (row === 0) return <circle cx="32" cy="32" r="14" {...props} />;
  if (row === 1) return <rect x="19" y="19" width="26" height="26" rx="5" {...props} />;
  return <path d="M32 17l15 27H17z" {...props} />;
}

// Пример задания-матрицы: фигура задаётся строкой, заливка — столбцом.
export function MatrixPuzzle() {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full"
      role="img"
      aria-label="Пример задания: какой фигуры не хватает в таблице три на три"
    >
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((col) => {
          const missing = row === 2 && col === 2;
          return (
            <g key={`${row}-${col}`} transform={`translate(${col * (CELL + GAP)} ${row * (CELL + GAP)})`}>
              <rect
                width={CELL}
                height={CELL}
                rx="16"
                className={missing ? "fill-highlight" : "fill-background"}
              />
              {missing ? (
                <text
                  x="32"
                  y="43"
                  textAnchor="middle"
                  className="fill-foreground text-[30px] font-extrabold"
                >
                  ?
                </text>
              ) : (
                <Shape row={row} fill={FILLS[col]} />
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
}
