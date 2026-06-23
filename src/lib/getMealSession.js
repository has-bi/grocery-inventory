export function getMealSession() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "pagi";
  if (hour >= 11 && hour < 16) return "siang";
  return "sore";
}
