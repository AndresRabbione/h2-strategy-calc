"use client";

import { useEffect, useState } from "react";

interface TimeUnit {
  value: number;
  unit: string;
}

export default function AssignmentCountdown({ endDate }: { endDate: Date }) {
  const [timeRemaining, setTimeRemaining] = useState<TimeUnit[]>([]);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining([{ value: 0, unit: "s" }]);
        return;
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
      ].filter((unit) => unit.value > 0);

      setTimeRemaining(units.slice(0, 2));
    };

    const timer = setInterval(calculateTimeRemaining, 1000);
    calculateTimeRemaining();

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
