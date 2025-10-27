import { getDisplayReadyAssingments } from "@/utils/helpers/displayTransform";
import { getLatestPlanetSnapshots } from "@/utils/helpers/progress";
import { createClient } from "@/utils/supabase/server";
import AssignmentsAside from "../../../../../components/assignmentAside";
import StepDisplayBox from "../../../../../components/strategyStepDisplayBox";
import SegmentedDispatchAside from "../../../../../components/segmentedDispatchAside";

export default async function IndividualHistoryPage({
  params,
}: {
  params: Promise<{ ids: string[] }>;
}) {
  const awaitedParams = await params;
  const ids = awaitedParams.ids.map((id) => parseInt(id, 10));

  const supabase = await createClient();

  const [{ data: assignments }, { data: allPlanets }, latestSnapshots] =
    await Promise.all([
      supabase
        .from("assignment")
        .select(
          "*, objective(*), strategy(*, strategyStep(*, planet_region_split(*)))"
        )
        .in("id", ids)
        .order("start_date", { ascending: true }),
      supabase.from("planet").select("*").order("id", { ascending: true }),
      getLatestPlanetSnapshots(supabase),
    ]);

  const lastEndDate = new Date(
    assignments?.reduce((latest, assignment) => {
      const assignmentEnd = new Date(assignment.actual_end_date!).getTime();

      return assignmentEnd > latest ? assignmentEnd : latest;
    }, 0) ?? Date.now()
  );

  const { data: dispatches } = await supabase
    .from("dispatch")
    .select("*")
    .gte(
      "published",
      assignments ? assignments[0].start_date : new Date().toISOString()
    )
    .lte("published", lastEndDate.toISOString())
    .order("published", { ascending: false });

  const strategies =
    assignments?.flatMap((assignment) => assignment.strategy) ?? [];

  const displayReadyAssignments = await getDisplayReadyAssingments(
    assignments ?? [],
    allPlanets ?? [],
    latestSnapshots,
    true
  );

  return (
    <main className="grid grid-cols-[20%_80%] flex-1 divide-x-1 divide-white">
      <AssignmentsAside assignments={displayReadyAssignments} />
      <div
        className={`${
          !dispatches || dispatches.length === 0
            ? "flex flex-row"
            : "grid grid-cols-[95%_5%]"
        } w-full h-full`}
      >
        <div className="p-3">
          {strategies.length > 0 ? (
            <StepDisplayBox
              strategies={strategies}
              allPlanets={allPlanets ?? []}
              horizontal={false}
            ></StepDisplayBox>
          ) : (
            <span className="h-full p-3 flex items-center justify-center text-2xl font-semibold">{`No assessment was made for ${
              displayReadyAssignments.length > 1 ? "these orders" : "this order"
            }`}</span>
          )}
        </div>
        {dispatches && dispatches.length > 0 && (
          <SegmentedDispatchAside
            dispatches={dispatches ?? []}
          ></SegmentedDispatchAside>
        )}
      </div>
    </main>
  );
}
