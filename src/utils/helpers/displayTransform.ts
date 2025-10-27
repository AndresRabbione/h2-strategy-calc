import {
  DBPlanet,
  DisplayAssignment,
  DisplayObjective,
  FullParsedAssignment,
  PlanetSnapshotFull,
} from "@/lib/typeDefinitions";
import { getParsedDBObjectiveText } from "../parsing/objectives";
import { getFactionFromObjective } from "../parsing/factions";
import { estimateHourlyRateForPlanet } from "./progress";

export async function getDisplayReadyAssingments(
  assignments: FullParsedAssignment[],
  allPlanets: DBPlanet[],
  latestSnapshots: PlanetSnapshotFull[],
  isHistorical: boolean
): Promise<DisplayAssignment[]> {
  const displayReadyAssignments: DisplayAssignment[] = await Promise.all(
    assignments.map(async (assignment) => {
      const objectives: DisplayObjective[] = await Promise.all(
        assignment.objective.map(async (objective) => {
          const text = getParsedDBObjectiveText(objective.parsed_text);
          const progressPerHour =
            objective.planetId && !isHistorical
              ? estimateHourlyRateForPlanet(
                  latestSnapshots.filter(
                    (snapshot) => snapshot.planetId === objective.planetId
                  )
                ).regression
              : 0;

          return {
            id: objective.id,
            type: objective.type,
            text,
            progress: objective.playerProgress,
            totalAmount: objective.totalAmount,
            enemyProgress: objective.enemyProgress,
            displayedFaction: getFactionFromObjective(
              objective,
              allPlanets ?? []
            ),
            order: objective.objectiveIndex,
            progressPerHour,
          };
        })
      );

      objectives.sort((a, b) => a.order - b.order);

      return {
        brief: assignment.brief,
        endDate: assignment.endDate,
        id: assignment.id,
        isMajorOrder: assignment.isMajorOrder,
        title: assignment.title,
        objectives,
        is_decision: assignment.is_decision,
      };
    })
  );

  return displayReadyAssignments;
}
