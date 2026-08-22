"use client";
import Sheet from "@/components/ui/Sheet";
import { scoreSession, tierFor } from "@/lib/sessionScore";
import { FiAward, FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";

function VolumeDelta({ delta }) {
  if (delta === null) {
    return <span className="text-ink-faint">sesi perdana</span>;
  }
  const pct = Math.round(delta * 100);
  if (Math.abs(pct) < 1) {
    return (
      <span className="inline-flex items-center gap-1 text-ink-muted">
        <FiMinus size={12} /> sama kayak kemarin
      </span>
    );
  }
  const up = pct > 0;
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${up ? "text-emerald-700" : "text-amber-700"}`}>
      {up ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
      {up ? "+" : ""}{pct}% dari sesi lalu
    </span>
  );
}

export default function SessionSummarySheet({
  sessionName,
  date,
  todaySets,
  priorSets,
  targetSets,
  prCount,
  onClose,
}) {
  const score = scoreSession({ todaySets, priorSets, targetSets, prCount });
  const tier = tierFor(score.total, `${date}${sessionName}`);

  return (
    <Sheet
      subtitle={sessionName}
      title="Rapor Sesi"
      onClose={onClose}
      footer={
        <button onClick={onClose} className="btn btn-primary btn-lg w-full">
          Udah, tutup
        </button>
      }
    >
      <div className="space-y-5 pb-2">
        {/* Verdict */}
        <div className="text-center py-2">
          <p className="text-6xl font-semibold text-ink tabular leading-none">{score.total}</p>
          <p className="text-xs text-ink-faint mt-1.5">dari 100</p>

          <h3 className="text-xl font-semibold text-ink mt-4">{tier.title}</h3>
          <p className="text-sm text-ink-muted mt-1">{tier.tagline}</p>
          <p className="text-sm text-ink-muted mt-3 italic px-2">&ldquo;{tier.line}&rdquo;</p>
        </div>

        {score.prCount > 0 && (
          <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-800 bg-emerald-50 rounded-xl px-3.5 py-3">
            <FiAward size={16} className="shrink-0" />
            {score.prCount} rekor baru pecah hari ini. Sombong dikit gapapa.
          </div>
        )}

        {/* Numbers */}
        <div className="card divide-y divide-line">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-ink-muted">Set kelar</span>
            <span className="text-sm font-semibold text-ink tabular">
              {score.done}
              {score.targetSets > 0 && (
                <span className="text-ink-faint font-normal">/{score.targetSets}</span>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-3">
            <span className="text-sm text-ink-muted shrink-0">Total angkatan</span>
            <span className="text-sm font-semibold text-ink tabular text-right">
              {Math.round(score.volume).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 gap-3">
            <span className="text-sm text-ink-muted shrink-0">Dibanding sesi lalu</span>
            <span className="text-xs text-right tabular">
              <VolumeDelta delta={score.volumeDelta} />
            </span>
          </div>
          {score.avgRpe !== null && (
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-ink-muted">Rata-rata RPE</span>
              <span className="text-sm font-semibold text-ink tabular">
                {score.avgRpe.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Breakdown — the score should never look like a magic number */}
        <div>
          <p className="section-label mb-2.5">Nilainya dari mana</p>
          <div className="space-y-2.5">
            {score.breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-ink-muted">{b.label}</span>
                  <span className="text-xs font-semibold text-ink tabular">
                    {b.value}
                    <span className="text-ink-faint font-normal">/{b.max}</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-raised overflow-hidden">
                  <div
                    className="h-full rounded-full bg-ink transition-[width] duration-500"
                    style={{ width: `${(b.value / b.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
