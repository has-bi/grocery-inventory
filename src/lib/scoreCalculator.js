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

export function getScoreColor(score) {
  if (score >= 70) return { text: "text-green-600", bg: "bg-green-600", label: "Bagus" };
  if (score >= 40) return { text: "text-yellow-600", bg: "bg-yellow-500", label: "Lumayan" };
  return { text: "text-red-600", bg: "bg-red-500", label: "Perlu Diperbaiki" };
}
