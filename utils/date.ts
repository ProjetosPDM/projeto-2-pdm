/**
 * Retorna a data formatada para o cabeçalho (Ex: Segunda-feira, 12 de Junho)
 */
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

/**
 * Retorna o dia da semana atual formatado exatamente como salvamos no banco
 * (Ex: "Segunda-feira", "Terça-feira", etc)
 */
export function getToday(): string {
  const now = new Date();
  const dayName = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(now);
  // Garante a primeira letra maiúscula para bater com o banco de dados
  return dayName.charAt(0).toUpperCase() + dayName.slice(1);
}

/**
 * Converte uma string de horário "HH:MM" em minutos totais desde o início do dia
 * Útil para comparações matemáticas de horário.
 */
export function timeToMinutes(time: string): number {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Calcula a porcentagem de progresso de uma aula com base no horário atual do dispositivo.
 */
export function calculateProgress(start: string, end: string): number {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  // Se a aula ainda não começou
  if (currentMinutes < startMinutes) return 0;
  
  // Se a aula já terminou
  if (currentMinutes > endMinutes) return 100;

  // Cálculo da porcentagem
  const totalDuration = endMinutes - startMinutes;
  const passedTime = currentMinutes - startMinutes;
  
  const percentage = Math.round((passedTime / totalDuration) * 100);
  
  return percentage;
}