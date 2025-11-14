export interface TimeUnit {
  value: number;
  unit: string;
}

export function calculateTimeRemaining(endDate: Date): TimeUnit[] {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) {
    return [{ value: 0, unit: "s" }];
  }

  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 7);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const units: TimeUnit[] = [
    { value: weeks, unit: "w" },
    { value: days, unit: "d" },
    { value: hours, unit: "h" },
    { value: minutes, unit: "m" },
    { value: seconds, unit: "s" },
  ];

  const firstNonZero = units.findIndex((unit) => unit.value !== 0);

  return units
    .slice(firstNonZero, firstNonZero + 2)
    .filter((unit) => unit.value !== 0);
}
