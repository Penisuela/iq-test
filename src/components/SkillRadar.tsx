const CX = 150;
const CY = 150;
const R = 105;
// Вершины треугольника: вверх, вправо-вниз, влево-вниз.
const ANGLES = [-90, 30, 150].map((deg) => (deg * Math.PI) / 180);

const point = (axis: number, share: number) =>
  `${(CX + Math.cos(ANGLES[axis]) * R * share).toFixed(1)},${(CY + Math.sin(ANGLES[axis]) * R * share).toFixed(1)}`;
const ring = (share: number) => [0, 1, 2].map((axis) => point(axis, share)).join(" ");

// Треугольная диаграмма трёх навыков; values — проценты от 0 до 100.
export function SkillRadar({ values }: { values: [number, number, number] }) {
  return (
    <svg viewBox="0 0 300 240" className="w-full" role="img" aria-label="Диаграмма навыков">
      {[1, 0.66, 0.33].map((share) => (
        <polygon
          key={share}
          points={ring(share)}
          fill="none"
          strokeWidth="1.5"
          className="stroke-white/25"
        />
      ))}
      {[0, 1, 2].map((axis) => (
        <line
          key={axis}
          x1={CX}
          y1={CY}
          x2={point(axis, 1).split(",")[0]}
          y2={point(axis, 1).split(",")[1]}
          strokeWidth="1.5"
          className="stroke-white/25"
        />
      ))}
      <polygon
        points={values.map((value, axis) => point(axis, value / 100)).join(" ")}
        strokeWidth="3"
        strokeLinejoin="round"
        className="fill-highlight/85 stroke-highlight"
      />
      {values.map((value, axis) => {
        const [x, y] = point(axis, value / 100).split(",");
        return <circle key={axis} cx={x} cy={y} r="6" strokeWidth="3" className="fill-accent stroke-white" />;
      })}
    </svg>
  );
}
