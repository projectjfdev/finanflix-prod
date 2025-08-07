export function calculateCompletionPercentage(
  totalLessons: number,
  viewedLessons: number
): number {
  if (totalLessons === 0) return 0; // Evitar división por cero
  const percentage = (viewedLessons / totalLessons) * 100;
  return parseFloat(percentage.toFixed(2)); // Convertir a número después de formatear
}
