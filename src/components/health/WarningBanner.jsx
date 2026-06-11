const SEVERITY_STYLES = {
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info: "bg-blue-50 border-blue-200 text-blue-700",
};

const SEVERITY_ICONS = {
  error: "⚠️",
  warning: "💪",
  info: "🚶",
};

export default function WarningBanner({ warnings }) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {warnings.map((w, i) => (
        <div
          key={i}
          className={`flex items-start gap-2 px-4 py-3 rounded-lg border text-sm ${SEVERITY_STYLES[w.severity]}`}
        >
          <span>{SEVERITY_ICONS[w.severity]}</span>
          <span>{w.message}</span>
        </div>
      ))}
    </div>
  );
}
