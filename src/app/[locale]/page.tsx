"use server";

import { createClient } from "@/utils/supabase/server";
import AssignmentsAside from "../../../components/assignmentAside";
import { getDisplayReadyAssingments } from "@/utils/helpers/displayTransform";
import DispatchAside from "../../../components/dispatchAside";
import { getLatestPlanetSnapshots } from "@/utils/helpers/progress";
import { getLocale } from "next-intl/server";
import StrategyContainer from "../../../components/strategyContainer";

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: assignments },
    { data: allPlanets },
    { data: sectors },
    { data: totalPlayerCount },
    latestSnapshots,
    { data: regions },
    locale,
  ] = await Promise.all([
    supabase
      .from("assignment")
      .select(
        "*, objective(*), strategy(*, strategyStep(*, planet_region_split(*)))"
      )
      .eq("is_active", true)
      .order("start_date", { ascending: true }),
    supabase
      .from("planet")
      .select("*, planet_event(*)")
      .order("id", { ascending: true }),
    supabase.from("sector").select("*").order("id", { ascending: true }),
    supabase
      .from("player_count_record")
      .select("player_count")
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    getLatestPlanetSnapshots(supabase),
    supabase.from("planet_region").select("*"),
    getLocale(),
  ]);

  const strategies =
    assignments?.flatMap((assignment) => assignment.strategy) ?? [];

  const displayReadyAssignments = await getDisplayReadyAssingments(
    assignments ?? [],
    allPlanets ?? [],
    latestSnapshots,
    false
  );

  return (
    <main className="grid grid-cols-[23%_77%] flex-1 divide-x divide-white max-h-svh min-h-0 h-screen overflow-hidden">
      <AssignmentsAside assignments={displayReadyAssignments} />
      <div className="grid grid-cols-[95%_5%] w-full h-full">
        <StrategyContainer
          displayReadyAssignments={displayReadyAssignments}
          strategies={strategies}
          allPlanets={allPlanets ?? []}
          sectors={sectors ?? []}
          totalPlayerCount={totalPlayerCount?.player_count ?? 0}
          latestSnapshots={latestSnapshots}
          regions={regions ?? []}
          locale={locale}
        ></StrategyContainer>
        <DispatchAside></DispatchAside>
      </div>
    </main>
  );
}
