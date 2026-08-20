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
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-3">Tren Berat Badan</p>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: "280px" }}>
          <g transform={`translate(${PAD.left},${PAD.top})`}>
            {[0, 0.5, 1].map((t) => {
              const y = t * chartH;
              const val = maxW - t * (maxW - minW);
              return (
                <g key={t}>
                  <line x1={0} y1={y} x2={chartW} y2={y} stroke="#f0f0f0" strokeWidth={1} />
                  <text x={-4} y={y + 3} textAnchor="end" fontSize={9} fill="#9ca3af">
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            <polygon points={polyFill} fill="#000" fillOpacity={0.04} />
            <polyline points={points} fill="none" stroke="#111" strokeWidth={1.5} strokeLinejoin="round" />

            {data.map((d, i) => (
              <circle key={i} cx={xScale(i)} cy={yScale(d.weight)} r={3} fill="#111" />
            ))}

            {data.map((d, i) => {
              const showLabel = i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2);
              if (!showLabel) return null;
              return (
                <text key={i} x={xScale(i)} y={chartH + 14} textAnchor="middle" fontSize={8} fill="#9ca3af">
                  {formatDate(d.date)}
                </text>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
