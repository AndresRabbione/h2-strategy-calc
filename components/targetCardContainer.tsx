import {
  DBPlanetFull,
  DBRegion,
  DBSector,
  DisplayTarget,
  FactionIDs,
  PlanetSnapshotFull,
  StrategyStepFull,
} from "@/lib/typeDefinitions";
import TargetCard from "./targetCard";
import { estimateHourlyRateForPlanet } from "@/utils/helpers/progress";

export default function TargetCardContainer({
  targets,
  allPlanets,
  sectors,
  totalPlayerCount,
  latestSnapshots,
  regions,
}: {
  targets: StrategyStepFull[];
  allPlanets: DBPlanetFull[];
  sectors: DBSector[];
  totalPlayerCount: number;
  latestSnapshots: PlanetSnapshotFull[];
  regions: DBRegion[];
}) {
  const groupedStepMap = targets.reduce((map, target) => {
    if (!map.has(target.planetId)) map.set(target.planetId, []);

    const entry = map.get(target.planetId)!;
    entry.push(target);
    return map;
  }, new Map<number, StrategyStepFull[]>());

  const finalSteps: StrategyStepFull[] = [];

  for (const steps of groupedStepMap.values()) {
    steps.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    finalSteps.push(steps[0]);
  }

  finalSteps.sort((a, b) => b.playerPercentage - a.playerPercentage);

  return (
    <div className="grid lg:grid-cols-3 w-full p-3 gap-3">
      {finalSteps.map((step) => {
        const planet = allPlanets[step.planetId];
        const filteredSnapshots = latestSnapshots.filter(
          (snapshot) => snapshot.planetId === step.planetId
        );
        filteredSnapshots.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const progress =
          filteredSnapshots.length !== 0
            ? 100 -
              (filteredSnapshots[0]?.health / filteredSnapshots[0]?.maxHealth) *
                100
            : planet.current_faction !== FactionIDs.HUMANS
            ? 0
            : 100;

        const displayTarget: DisplayTarget = {
          id: step.planetId,
          name: planet.name,
          sector: sectors[planet.sector],
          playerCount: planet.player_count,
          progressPerHour:
            estimateHourlyRateForPlanet(filteredSnapshots).regression,
          regenPerHour: planet.latest_regen,
          assignedPercentage: step.playerPercentage,
          progress,
          currentOwner: planet.current_faction,
          event: planet.planet_event,
          regionSplits: step.planet_region_split,
        };

        return (
          <TargetCard
            key={step.id}
            target={displayTarget}
            totalPlayerCount={totalPlayerCount}
            regions={regions}
          ></TargetCard>
        );
      })}
    </div>
  );
}
