import { getHolidays } from "./getHolidays";

export function calculateBusinessDate(
  startDate: Date,
  days: number,
  isHoliday: (date: Date) => boolean
): Date {
  const resultDate = new Date(startDate);
  let addedDays = 0;

  while (addedDays < days) {
    resultDate.setDate(resultDate.getDate() + 1); // Avança um dia
    const dayOfWeek = resultDate.getDay(); // 0 (Domingo) a 6 (Sábado)

    // Ignora finais de semana e feriados
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(resultDate)) {
      addedDays++;
    }
  }

  return resultDate;
}
