export function getFormattedDate(): string {
  const now = new Date();

  const formatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  const [weekDay, rest] = formatted.split(", ");
  const capitalizedWeekDay = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);

  const [day, month] = rest.split(" de ");
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  return `${capitalizedWeekDay}, ${day} de ${capitalizedMonth}`;
}
