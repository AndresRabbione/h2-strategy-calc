"use server";

import { createClient } from "@/utils/supabase/server";
import AssignmentsAside from "../../../components/assignmentAside";
import { getDisplayReadyAssingments } from "@/utils/helpers/displayTransform";
import DispatchAside from "../../../components/dispatchAside";
import TargetCardContainer from "../../../components/targetCardContainer";
import { getLatestPlanetSnapshots } from "@/utils/helpers/progress";
import { getLocale } from "next-intl/server";

export default async function Home() {
  const [supabase] = await Promise.all([createClient()]);

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
      .eq("is_active", true),
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
    locale,
    latestSnapshots
  );

  return (
    <main className="grid grid-cols-[20%_80%] flex-1 divide-x-1 divide-white">
      <AssignmentsAside assignments={displayReadyAssignments} locale={locale} />
      <div className="grid grid-cols-[95%_5%] w-full h-full">
        <TargetCardContainer
          targets={strategies.flatMap((strategy) => strategy.strategyStep)}
          allPlanets={allPlanets ?? []}
          sectors={sectors ?? []}
          totalPlayerCount={totalPlayerCount?.player_count ?? 0}
          latestSnapshots={latestSnapshots}
          regions={regions ?? []}
        ></TargetCardContainer>
        <DispatchAside></DispatchAside>
      </div>
    </main>
  );
}
