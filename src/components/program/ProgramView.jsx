"use client";
import { useState, useMemo } from "react";
import { useProgram } from "@/hooks/useProgram";
import TutorialSheet from "@/components/workout/TutorialSheet";
import { DAY_NAMES, buildScheduleMap } from "@/lib/streak";
import { FiAlertCircle, FiHelpCircle, FiMoon, FiExternalLink } from "react-icons/fi";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1KeDvjqh_vf73zVw7xKlCAuAQYuXI-QKzsfOPrVkbYqk/edit";

/** Monday-first for reading order; the array itself is Sunday-indexed. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0].map((i) => DAY_NAMES[i]);

export default function ProgramView() {
  const { loading, error, bySession, exercises, schedule } = useProgram();
  const [tutorialFor, setTutorialFor] = useState(null);
  const [activeDay, setActiveDay] = useState(() => DAY_NAMES[new Date().getDay()]);

  const scheduleMap = useMemo(() => buildScheduleMap(schedule), [schedule]);
  const exerciseByName = useMemo(
    () => Object.fromEntries(exercises.map((e) => [e.name, e])),
    [exercises]
  );

  const hasTutorial = (name) => {
    const e = exerciseByName[name];
    return Boolean(e && (String(e.video_url || "").trim() || String(e.cues || "").trim()));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="h-8 w-36 rounded-lg bg-surface-raised animate-pulse" />
        <div className="h-9 w-full rounded-xl bg-surface-raised animate-pulse" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 w-full rounded-2xl bg-surface-raised animate-pulse" />
        ))}
      </div>
    );
  }

  const plan = scheduleMap[activeDay];
  const isRest = !plan || plan.isRest;
  const sessionName = plan?.session || "";
  const list = isRest ? [] : bySession[sessionName] || [];
  const totalSets = list.reduce((n, p) => n + (p.target_sets || 0), 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <header>
        <h1 className="page-title">Program</h1>
        <p className="page-sub">Jadwal mingguan — diatur dari Google Sheet</p>
      </header>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-3.5 py-3">
          <FiAlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Day picker — the schedule is the source of truth for what runs when */}
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {WEEK_ORDER.map((day) => {
          const p = scheduleMap[day];
          const rest = !p || p.isRest;
          const active = activeDay === day;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              aria-pressed={active}
              className={`btn btn-sm shrink-0 whitespace-nowrap ${
                active ? "btn-primary" : "btn-secondary"
              } ${rest && !active ? "text-ink-faint" : ""}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {isRest ? (
        <div className="card p-8 text-center">
          <FiMoon size={22} className="mx-auto text-ink-faint mb-3" />
          <p className="text-sm font-medium text-ink mb-1">Hari istirahat</p>
          <p className="text-sm text-ink-muted">
            {plan?.notes || "Recovery. Streak lo tetap aman di hari ini."}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-semibold text-ink">{sessionName}</p>
            {list.length > 0 && (
              <p className="text-xs text-ink-muted tabular">
                {list.length} exercise · {totalSets} set
              </p>
            )}
          </div>

          <div className="space-y-2">
            {list.map((p, idx) => (
              <div key={p._id} className="card px-4 py-3 flex items-center gap-3">
                <span className="w-5 shrink-0 text-xs font-semibold text-ink-faint tabular text-right">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{p.exercise_name}</p>
                  <p className="text-xs text-ink-muted mt-0.5 tabular">
                    {p.target_sets} × {p.target_reps}
                    {p.target_weight > 0 ? ` @ ${p.target_weight}kg` : ""}
                    {p.rest_seconds > 0 ? ` · ${p.rest_seconds}s` : ""}
                  </p>
                </div>
                {hasTutorial(p.exercise_name) && (
                  <button
                    onClick={() => setTutorialFor(p.exercise_name)}
                    aria-label={`Tutorial ${p.exercise_name}`}
                    className="btn btn-ghost btn-xs w-8 shrink-0"
                  >
                    <FiHelpCircle size={16} />
                  </button>
                )}
              </div>
            ))}

            {list.length === 0 && (
              <div className="card p-8 text-center">
                <p className="text-sm font-medium text-ink mb-1">
                  Belum ada exercise buat {sessionName}
                </p>
                <p className="text-sm text-ink-muted">
                  Tambahin barisnya di sheet <span className="font-medium text-ink">Programs</span>{" "}
                  dengan session <span className="font-medium text-ink">{sessionName}</span>.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <a
        href={SHEET_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary btn-md w-full"
      >
        Edit di Google Sheet
        <FiExternalLink size={14} className="text-ink-faint" />
      </a>

      <p className="text-xs text-ink-faint text-center leading-relaxed">
        <span className="font-medium">Schedule</span> ngatur hari &amp; rest day ·{" "}
        <span className="font-medium">Programs</span> ngatur exercise ·{" "}
        <span className="font-medium">Exercises</span> ngatur tutorial
      </p>

      {tutorialFor && (
        <TutorialSheet
          exercise={exerciseByName[tutorialFor] ?? { name: tutorialFor }}
          programInfo={list.find((p) => p.exercise_name === tutorialFor) ?? null}
          onClose={() => setTutorialFor(null)}
        />
      )}
    </div>
  );
}
