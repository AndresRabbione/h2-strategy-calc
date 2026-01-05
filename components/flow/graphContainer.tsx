import {
  DBPlanetFull,
  DBRegion,
  DBSector,
  DisplayAssignment,
  FullStrategy,
  PlanetSnapshotFull,
  StrategyStepFull,
} from "@/lib/typeDefinitions";
import StratInfoDisplay from "../stratInfoDisplay";
import { useStepGraph } from "../../hooks/useStepGraph";
import GraphCanvas from "./graphCanvas";

export default function GraphContainer({
  displayReadyAssignments,
  strategies,
  allPlanets,
  sectors,
  totalPlayerCount,
  latestSnapshots,
  regions,
  locale,
}: {
  displayReadyAssignments: DisplayAssignment[];
  strategies: FullStrategy[];
  allPlanets: DBPlanetFull[];
  sectors: DBSector[];
  totalPlayerCount: number;
  latestSnapshots: PlanetSnapshotFull[];
  regions: DBRegion[];
  locale: string;
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
  const graph = useStepGraph([...parsedMap]);

  return (
    <div className="flex flex-col bg-gray-900 text-gray-100">
      <StratInfoDisplay
        totalPlayerCount={totalPlayerCount}
        minDifficulty={1}
        maxDifficulty={10}
        factions={[]}
      />

      <div className="flex flex-1">
        <main className="flex-1 h-[calc(100vh-64px-54.4px)] relative">
          <GraphCanvas {...graph}></GraphCanvas>
        </main>

        <aside className="w-96 border-l border-gray-800 bg-gray-950 p-4">
          <Inspector {...graph}></Inspector>
        </aside>
      </div>
    </div>
  );
}
