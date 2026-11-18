export type FigureCell = {
  shape: "circle" | "square" | "triangle" | "diamond";
  fill: "outline" | "tint" | "solid";
  count: number;
  rotation: number;
};

const FILL_CLASS: Record<FigureCell["fill"], string> = {
  outline: "fill-none stroke-foreground",
  tint: "fill-accent/25 stroke-accent",
  solid: "fill-foreground stroke-foreground",
};

// Центры фигур в клетке 64×64 и их масштаб в зависимости от количества.
const LAYOUTS: Record<number, { scale: number; centers: [number, number][] }> = {
  1: { scale: 1, centers: [[32, 32]] },
  2: { scale: 0.62, centers: [[20, 32], [44, 32]] },
  3: { scale: 0.55, centers: [[32, 19], [19, 43], [45, 43]] },
};

function Shape({ shape, className }: { shape: FigureCell["shape"]; className: string }) {
  const props = { strokeWidth: 3, strokeLinejoin: "round" as const, className };
  switch (shape) {
    case "circle":
      return <circle r="14" {...props} />;
    case "square":
      return <rect x="-13" y="-13" width="26" height="26" rx="5" {...props} />;
    case "diamond":
      return <path d="M0 -17L15 0L0 17L-15 0Z" {...props} />;
    case "triangle":
      return <path d="M0 -14L15 12H-15Z" {...props} />;
  }
}

// Содержимое одной клетки. Рисуется внутри <svg> с системой координат 64×64.
export function FigureShapes({ cell }: { cell: FigureCell }) {
  const { scale, centers } = LAYOUTS[cell.count] ?? LAYOUTS[1];
  return (
    <>
      {centers.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${scale}) rotate(${cell.rotation})`}>
          <Shape shape={cell.shape} className={FILL_CLASS[cell.fill]} />
        </g>
      ))}
    </>
  );
}

// Отдельная фигура — используется в вариантах ответа.
export function Figure({ cell, className = "w-full" }: { cell: FigureCell; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <FigureShapes cell={cell} />
    </svg>
  );
}
