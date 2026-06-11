export default function WeightChart({ logs }) {
  const dataPoints = logs
    .slice()
    .reverse()
    .filter((l) => l.weight && parseFloat(l.weight) > 0)
    .slice(-14)
    .map((l) => ({
      date: l.date,
      weight: parseFloat(l.weight),
    }));

  if (dataPoints.length < 2) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-gray-500">
        Data berat belum cukup untuk ditampilkan
      </div>
    );
  }

  const weights = dataPoints.map((d) => d.weight);
  const minW = Math.min(...weights) - 1;
  const maxW = Math.max(...weights) + 1;
  const range = maxW - minW || 1;

  const W = 400;
  const H = 80;
  const PAD = 4;

  const pts = dataPoints.map((d, i) => {
    const x = PAD + (i / (dataPoints.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((d.weight - minW) / range) * (H - PAD * 2);
    return { x, y, ...d };
  });

  const pathD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Trend Berat Badan</p>
      <div className="flex items-end gap-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="flex-1 h-20" preserveAspectRatio="none">
          <path
            d={pathD}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3b82f6" />
          ))}
        </svg>
        <div className="text-right shrink-0">
          <p className="text-lg font-light text-black">{pts[pts.length - 1].weight} kg</p>
          <p className="text-xs text-gray-500">terakhir</p>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{pts[0].date.slice(5)}</span>
        <span>{pts[pts.length - 1].date.slice(5)}</span>
      </div>
    </div>
  );
}
