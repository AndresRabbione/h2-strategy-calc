import { FactionIDs } from "@/lib/typeDefinitions";
import { createClient } from "@/utils/supabase/server";
import AssignmentsAside from "../../../../components/assignmentAside";
import { getDisplayReadyAssingments } from "@/utils/helpers/displayTransform";
import { getLocale } from "next-intl/server";
import { getLatestPlanetSnapshots } from "@/utils/helpers/progress";
import DispatchAside from "../../../../components/dispatchAside";
import { getFactionColorFromId } from "@/utils/parsing/factions";

export default async function RealisticStrategyPage() {
  const supabase = await createClient();

  const { data: blobPlanet } = await supabase
    .from("planet")
    .select("*")
    .order("player_count", { ascending: false })
    .or(
      `current_faction.neq.${FactionIDs.HUMANS},and(current_faction.eq.${FactionIDs.HUMANS},current_event.not.is.null)`
    )
    .limit(1)
    .single();

  const [{ data: assignments }, { data: allPlanets }, latestSnapshots, locale] =
    await Promise.all([
      supabase
        .from("assignment")
        .select(
          "*, objective(*), strategy(*, strategyStep(*, planet_region_split(*)))"
        )
        .eq("is_active", true),
      supabase
        .from("planet")
        .select("*, planet_event(*)")
        .order("id", { ascending: true }),
      getLatestPlanetSnapshots(supabase),
      getLocale(),
    ]);

  const displayReadyAssignments = await getDisplayReadyAssingments(
    assignments ?? [],
    allPlanets ?? [],
    locale,
    latestSnapshots
  );

  return (
    <main className="grid grid-cols-[20%_80%] flex-1 divide-x-1 divide-white">
      <AssignmentsAside assignments={displayReadyAssignments} locale={locale} />
      <div className="grid grid-cols-[95%_5%] w-full h-full">
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl">
            The Blob has decreed
            <span
              style={{
                color: getFactionColorFromId(
                  blobPlanet?.current_faction ?? 1,
                  false
                ),
              }}
            >
              {` ${blobPlanet?.name ?? "nothing"} `}
            </span>
            as your target
          </p>
          <span className="text-helldiver-yellow text-3xl">
            {blobPlanet?.player_count ?? "Unknown"}
          </span>
        </div>
        <DispatchAside></DispatchAside>
      </div>
    </main>
  );
}
