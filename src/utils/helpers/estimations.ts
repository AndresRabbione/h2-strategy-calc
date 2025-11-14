import { DBEvent } from "@/lib/typeDefinitions";

export function estimateTimeToVictory(
  progressPerHour: number,
  currentProgress: number,
  event: DBEvent | null
): number {
  if (progressPerHour <= 0) return Infinity;

  const estimatedVictoryTime = (100 - currentProgress) / progressPerHour;

  const eventFailureTime = event
    ? new Date(event.end_time).getTime() / 3600000
    : null;

  return eventFailureTime && eventFailureTime >= estimatedVictoryTime
    ? Infinity
    : estimatedVictoryTime;
}
