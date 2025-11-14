"use client";

import {
  DBPlanet,
  DBRegion,
  FullStrategy,
  StrategyStepFull,
} from "@/lib/typeDefinitions";
import StepChainsHorizontal from "./stepChainHorizontal";
import StepChainsVertical from "./stepChainVertical";
import { useEffect, useRef, useState } from "react";

export default function StepDisplayBox({
  strategies,
  allPlanets,
  horizontal = false,
  regions,
  totalPlayerCount,
}: {
  strategies: FullStrategy[];
  allPlanets: DBPlanet[];
  horizontal?: boolean;
  regions: DBRegion[];
  totalPlayerCount: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setHeight] = useState(0);
  const [containerWidth, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.offsetHeight);
      setWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const groupedStepMap = strategies.reduce((map, strategy) => {
    strategy.strategyStep.forEach((step) => {
      if (!map.has(step.planetId))
        map.set(step.planetId, {
          steps: [],
          firstTimeStamp: new Date().toISOString(),
        });

      const entry = map.get(step.planetId)!;
      entry.steps.push(step);

      if (entry.firstTimeStamp > step.created_at) {
        entry.firstTimeStamp = step.created_at;
      }
    });
    return map;
  }, new Map<number, { steps: StrategyStepFull[]; firstTimeStamp: string }>());

  for (const step of groupedStepMap.values()) {
    step.steps.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  const parsedMap = groupedStepMap
    .entries()
    .map(([planetId, { steps, firstTimeStamp }]) => {
      return {
        planetId,
        steps,
        firstTimeStamp,
      };
    });

  return (
    <div className="border-white border h-full" ref={containerRef}>
      {horizontal ? (
        <StepChainsHorizontal
          steps={[...parsedMap]}
          height={containerHeight}
          width={containerWidth}
          allPlanets={allPlanets}
        ></StepChainsHorizontal>
      ) : (
        <StepChainsVertical
          steps={[...parsedMap]}
          allPlanets={allPlanets}
          height={containerHeight}
          width={containerWidth}
          regions={regions}
          totalPlayerCount={totalPlayerCount}
        ></StepChainsVertical>
      )}
    </div>
  );
}
