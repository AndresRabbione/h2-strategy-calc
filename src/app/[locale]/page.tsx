"use server";

import { createClient } from "@/utils/supabase/server";
import { getAllAssignments } from "@/heldiversAPI/assignments";
import AssignmentsAside from "../../../components/assignmentAside";
import { fetchAllPlanets } from "@/heldiversAPI/planets";
import { DisplayAssignment, DisplayObjective } from "@/lib/typeDefinitions";
import { getObjectiveText } from "@/utils/parsing/objectives";
import { getFactionFromObjective } from "@/utils/parsing/factions";

export default async function Home() {
  const maxRetries = 3;
  const now = new Date().toISOString();
  const [supabase, currentAssignments, allPlanets] = await Promise.all([
    createClient(),
    getAllAssignments(),
    fetchAllPlanets(),
  ]);

  let { data: assignments } = await supabase
    .from("assignment")
    .select("*, objective(*)")
    .gte("endDate", now);

  for (let retry = 0; retry < maxRetries && !assignments; retry++) {
    const { data } = await supabase
      .from("assignment")
      .select("*, objective(*)")
      .gte("endDate", now);
    assignments = data;
  }

  const assignmentIds =
    currentAssignments?.map((assignment) => assignment.id32) ?? [];

  assignments =
    assignments?.filter((assignment) =>
      assignmentIds.includes(assignment.id)
    ) ?? [];

  const displayReadyAssignments: DisplayAssignment[] = await Promise.all(
    assignments.map(async (assignment) => {
      const objectives: DisplayObjective[] = await Promise.all(
        assignment.objective.map(async (objective) => {
          const text = await getObjectiveText(objective, allPlanets);
          return {
            id: objective.id,
            type: objective.type,
            text,
            progress: objective.playerProgress,
            totalAmount: objective.totalAmount,
            enemyProgress: objective.enemyProgress,
            displayedFaction: getFactionFromObjective(objective, allPlanets),
          };
        })
      );

      return {
        brief: assignment.brief,
        endDate: assignment.endDate,
        id: assignment.id,
        isMajorOrder: assignment.isMajorOrder,
        title: assignment.title,
        objectives,
      };
    })
  );

  return (
    <main className="flex flex-row min-h-full divide-y-1 divide-white">
      <div></div>
      <AssignmentsAside assignments={displayReadyAssignments} />
    </main>
  );
}
