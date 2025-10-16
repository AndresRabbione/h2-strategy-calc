import {
  DBPlanet,
  FullStrategy,
  StrategyStepFull,
} from "@/lib/typeDefinitions";
import StepChainsHorizontal from "./stepChainHorizontal";
import StepChainsVertical from "./stepChainVertical";

export default function StepDisplayBox({
  strategies,
  allPlanets,
}: {
  strategies: FullStrategy[];
  allPlanets: DBPlanet[];
}) {
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
    <div className="border-white border-1 h-full m-3 basis-11/12">
      <StepChainsVertical
        steps={[...parsedMap]}
        allPlanets={allPlanets}
      ></StepChainsVertical>
    </div>
  );
}
