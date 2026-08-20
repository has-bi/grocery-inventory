"use client";

export default function MetricsChart({ metrics }) {
  const data = [...metrics].reverse().slice(-12);
  if (data.length < 2) return null;

  const W = 320;
  const H = 120;
  const PAD = { top: 10, right: 10, bottom: 24, left: 36 };

  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const weights = data.map((d) => d.weight);
  const minW = Math.min(...weights) - 1;
  const maxW = Math.max(...weights) + 1;

  const xScale = (i) => (i / (data.length - 1)) * chartW;
  const yScale = (v) => chartH - ((v - minW) / (maxW - minW)) * chartH;

  const points = data.map((d, i) => `${xScale(i)},${yScale(d.weight)}`).join(" ");
  const polyFill = `${xScale(0)},${chartH} ` + points + ` ${xScale(data.length - 1)},${chartH}`;

  const formatDate = (d) =>
    new Date(d + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" });

  return (
    <div className="card card-compact bg-base-100 border border-base-300">
      <div className="card-body">
        <p className="text-xs font-medium text-base-content/60 mb-2">Tren Berat Badan</p>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: "280px" }}>
            <g transform={`translate(${PAD.left},${PAD.top})`}>
              {[0, 0.5, 1].map((t) => {
                const y = t * chartH;
                const val = maxW - t * (maxW - minW);
                return (
                  <g key={t}>
                    <line x1={0} y1={y} x2={chartW} y2={y} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
                    <text x={-4} y={y + 3} textAnchor="end" fontSize={9} fill="currentColor" fillOpacity={0.45}>
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              <polygon points={polyFill} fill="currentColor" fillOpacity={0.06} />
              <polyline points={points} fill="none" stroke="currentColor" strokeOpacity={0.9} strokeWidth={1.5} strokeLinejoin="round" />

              {data.map((d, i) => (
                <circle key={i} cx={xScale(i)} cy={yScale(d.weight)} r={3} fill="currentColor" fillOpacity={0.9} />
              ))}

              {data.map((d, i) => {
                const showLabel = i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2);
                if (!showLabel) return null;
                return (
                  <text key={i} x={xScale(i)} y={chartH + 14} textAnchor="middle" fontSize={8} fill="currentColor" fillOpacity={0.45}>
                    {formatDate(d.date)}
                  </text>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
