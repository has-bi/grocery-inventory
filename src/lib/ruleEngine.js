import { FOOD_CATEGORIES } from "./foodData";

export function runRuleEngine(todayEntry, recentLogs) {
  const warnings = [];

  const allMealsToday = [
    ...(todayEntry.meals?.pagi || []),
    ...(todayEntry.meals?.siang || []),
    ...(todayEntry.meals?.sore || []),
  ];

  const yesterday = recentLogs[0];

  // Rule 1: Same watch-list food 2 days in a row
  if (yesterday) {
    const allMealsYesterday = [
      ...(yesterday.meals?.pagi || []),
      ...(yesterday.meals?.siang || []),
      ...(yesterday.meals?.sore || []),
    ];
    for (const food of FOOD_CATEGORIES.watch.items) {
      if (allMealsToday.includes(food) && allMealsYesterday.includes(food)) {
        warnings.push({
          type: "consecutive_bad_food",
          severity: "error",
          message: `${food} 2 hari berturut-turut — kasih break dulu.`,
        });
      }
    }
  }

  // Rule 2: No protein but meals logged
  const hasProtein = allMealsToday.some((f) => FOOD_CATEGORIES.protein.items.includes(f));
  if (allMealsToday.length > 0 && !hasProtein) {
    warnings.push({
      type: "no_protein",
      severity: "warning",
      message: "Belum ada protein hari ini. Tambahkan telur, ayam, atau tempe.",
    });
  }

  // Rule 3: 3 consecutive days no exercise
  const skipStreak = recentLogs
    .slice(0, 2)
    .filter((log) => !log.exercise).length;
  if (!todayEntry.exercise && skipStreak >= 2) {
    warnings.push({
      type: "exercise_streak",
      severity: "info",
      message: "3 hari tidak olahraga. Yuk gerak sedikit hari ini!",
    });
  }

  return warnings;
}
