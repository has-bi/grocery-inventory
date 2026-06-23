import { FOOD_CATEGORIES } from "./foodData";

export function calculateScore(entry, warnings) {
  const allMeals = [
    ...(entry.meals?.pagi || []),
    ...(entry.meals?.siang || []),
    ...(entry.meals?.sore || []),
  ];

  let score = 50;

  if (entry.exercise) score += 20;

  const hasProtein = allMeals.some((f) => FOOD_CATEGORIES.protein.items.includes(f));
  if (hasProtein) score += 20;

  const hasGoodFood = allMeals.some(
    (f) =>
      FOOD_CATEGORIES.karboBaik.items.includes(f) ||
      FOOD_CATEGORIES.sayurBuah.items.includes(f)
  );
  if (hasGoodFood) score += 10;

  const hasWatchFood = allMeals.some((f) => FOOD_CATEGORIES.watch.items.includes(f));
  if (hasWatchFood) score -= 20;

  const penalties = warnings.filter((w) => w.type === "consecutive_bad_food").length;
  score -= penalties * 10;

  return Math.max(0, Math.min(100, score));
}

export function getScoreBreakdown(entry, warnings) {
  const allMeals = [
    ...(entry.meals?.pagi || []),
    ...(entry.meals?.siang || []),
    ...(entry.meals?.sore || []),
  ];

  const hasExercise = !!entry.exercise;
  const hasProtein = allMeals.some((f) => FOOD_CATEGORIES.protein.items.includes(f));
  const hasGoodFood = allMeals.some(
    (f) =>
      FOOD_CATEGORIES.karboBaik.items.includes(f) ||
      FOOD_CATEGORIES.sayurBuah.items.includes(f)
  );
  const hasWatchFood = allMeals.some((f) => FOOD_CATEGORIES.watch.items.includes(f));
  const consecutivePenalties = warnings.filter((w) => w.type === "consecutive_bad_food").length;

  const items = [
    { label: "Olahraga", delta: 20, achieved: hasExercise },
    { label: "Protein", delta: 20, achieved: hasProtein },
    { label: "Karbo Baik / Sayur", delta: 10, achieved: hasGoodFood },
  ];

  if (hasWatchFood) {
    items.push({ label: "Makanan Watch", delta: -20, isDeduction: true });
  }
  if (consecutivePenalties > 0) {
    items.push({ label: "Watch 2 hari berturut", delta: -10 * consecutivePenalties, isDeduction: true });
  }

  return items;
}

// Text shades are -700 so small labels pass WCAG AA on white; bars stay vivid (non-text)
export function getScoreColor(score) {
  if (score >= 70) return { text: "text-emerald-700", bg: "bg-emerald-500", label: "Bagus" };
  if (score >= 40) return { text: "text-amber-700", bg: "bg-amber-500", label: "Lumayan" };
  return { text: "text-red-700", bg: "bg-red-500", label: "Perlu Diperbaiki" };
}
