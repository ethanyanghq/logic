export type LocalDateString = `${number}-${number}-${number}`;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toLocalDateString(input: Date | number | string = new Date()): LocalDateString {
  if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return input as LocalDateString;
  }

  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date input: ${String(input)}`);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}` as LocalDateString;
}

export function toIsoTimestamp(input: Date | number | string = new Date()): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid timestamp input: ${String(input)}`);
  }

  return date.toISOString();
}

export function compareLocalDates(a: LocalDateString, b: LocalDateString): number {
  return toUtcMidnightMs(a) - toUtcMidnightMs(b);
}

export function getLocalDateDistanceInDays(
  start: LocalDateString,
  end: LocalDateString,
): number {
  return Math.round((toUtcMidnightMs(end) - toUtcMidnightMs(start)) / MS_PER_DAY);
}

export function getMostRecentLocalDate(
  dates: readonly LocalDateString[],
): LocalDateString | null {
  if (dates.length === 0) {
    return null;
  }

  return [...dates].sort(compareLocalDates).at(-1) ?? null;
}

export function getPriorLocalDates(
  anchor: LocalDateString,
  count: number,
): LocalDateString[] {
  const dates: LocalDateString[] = [];
  const [year, month, day] = anchor.split("-").map((part) => Number(part));

  for (let offset = 0; offset < count; offset += 1) {
    const date = new Date(Date.UTC(year, month - 1, day - offset));
    dates.push(toLocalDateString(date));
  }

  return dates;
}

export function getHoursSince(
  input: Date | number | string,
  reference: Date | number | string = new Date(),
): number {
  const earlier = input instanceof Date ? input : new Date(input);
  const later = reference instanceof Date ? reference : new Date(reference);
  if (Number.isNaN(earlier.getTime()) || Number.isNaN(later.getTime())) {
    throw new Error("Invalid timestamp input.");
  }

  return (later.getTime() - earlier.getTime()) / (60 * 60 * 1000);
}

function toUtcMidnightMs(localDate: LocalDateString): number {
  const [year, month, day] = localDate.split("-").map((part) => Number(part));
  return Date.UTC(year, month - 1, day);
}

