"use client";

import { calculateTimeRemaining } from "@/utils/helpers/timeCalcs";
import { useEffect, useState } from "react";

interface TimeUnit {
  value: number;
  unit: string;
}

export default function AssignmentCountdown({ endDate }: { endDate: Date }) {
  const [timeRemaining, setTimeRemaining] = useState<TimeUnit[]>([]);

  useEffect(() => {
    const timer = setInterval(
      () => setTimeRemaining(calculateTimeRemaining(endDate)),
      1000
    );
    setTimeRemaining(calculateTimeRemaining(endDate));

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeRemaining.length) return null;

  return (
    <span className="rounded-sm bg-helldiver-yellow text-black p-1">
      {timeRemaining
        .map(
          (unit, index) =>
            `${unit.value}${unit.unit}${
              index === 0 && timeRemaining.length > 1 ? " " : ""
            }`
        )
        .join("")}
    </span>
  );
}
