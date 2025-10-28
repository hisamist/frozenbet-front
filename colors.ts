// utils/colors.ts
export const iconColors = [
  "#1E88E5", // Bleu
  "#43A047", // Vert
  "#E53935", // Rouge
  "#8E24AA", // Violet
  "#FB8C00", // Orange
  "#00ACC1", // Cyan
  "#FDD835", // Jaune
  "#5E35B1", // Indigo
];

// Fonction réutilisable pour obtenir une couleur selon un id
export function getIconColorById(id: number) {
  return iconColors[(id - 1) % iconColors.length];
}
