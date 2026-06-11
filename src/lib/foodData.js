// Active (selected) chip shades are -700/-800 so white text passes WCAG AA (≥4.5:1)
export const FOOD_CATEGORIES = {
  protein: {
    label: "Protein",
    items: ["Telur", "Ayam", "Ikan", "Tahu", "Tempe"],
    chipClass: "bg-green-100 text-green-800 border-green-300",
    activeClass: "bg-green-800 text-white border-green-800",
  },
  karboBaik: {
    label: "Karbo Baik",
    items: ["Nasi Merah", "Ubi", "Oat"],
    chipClass: "bg-blue-100 text-blue-800 border-blue-300",
    activeClass: "bg-blue-700 text-white border-blue-700",
  },
  sayurBuah: {
    label: "Sayur & Buah",
    items: ["Sayur", "Buah"],
    chipClass: "bg-teal-100 text-teal-800 border-teal-300",
    activeClass: "bg-teal-700 text-white border-teal-700",
  },
  other: {
    label: "Lainnya",
    items: ["Nasi Putih", "Roti"],
    chipClass: "bg-gray-100 text-gray-700 border-gray-300",
    activeClass: "bg-gray-700 text-white border-gray-700",
  },
  watch: {
    label: "Watch",
    items: ["Mie Instan", "Gorengan", "Minuman Manis", "Snack Kemasan"],
    chipClass: "bg-orange-100 text-orange-800 border-orange-300",
    activeClass: "bg-orange-700 text-white border-orange-700",
  },
};

export const ALL_FOODS = Object.values(FOOD_CATEGORIES).flatMap((c) => c.items);

export function getFoodCategory(food) {
  for (const [key, cat] of Object.entries(FOOD_CATEGORIES)) {
    if (cat.items.includes(food)) return key;
  }
  return "other";
}

export function getFoodChipClass(food, isSelected) {
  const key = getFoodCategory(food);
  const cat = FOOD_CATEGORIES[key];
  return isSelected ? cat.activeClass : cat.chipClass;
}
