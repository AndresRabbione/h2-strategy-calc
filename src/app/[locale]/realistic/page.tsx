import { BlobTarget, FactionIDs } from "@/lib/typeDefinitions";
import { createClient } from "@/utils/supabase/server";
import AssignmentsAside from "../../../../components/assignmentAside";
import { getDisplayReadyAssingments } from "@/utils/helpers/displayTransform";
import {
  estimateHourlyRateForPlanet,
  getLatestPlanetSnapshots,
} from "@/utils/helpers/progress";
import DispatchAside from "../../../../components/dispatchAside";
import BlobCard from "../../../../components/blobCard";
import { getLocale } from "next-intl/server";

export default async function RealisticStrategyPage() {
  const supabase = await createClient();

  const { data: blobPlanet } = await supabase
    .from("planet")
    .select("*, sector(*), planet_event(*)")
    .order("player_count", { ascending: false })
    .or(
      `current_faction.neq.${FactionIDs.HUMANS},and(current_faction.eq.${FactionIDs.HUMANS},current_event.not.is.null)`
    )
    .limit(1)
    .single();

  const [
    { data: assignments },
    { data: allPlanets },
    latestSnapshots,
    locale,
    { data: totalPlayerCount },
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
    getLatestPlanetSnapshots(supabase),
    getLocale(),
    supabase
      .from("player_count_record")
      .select("player_count")
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const displayReadyAssignments = await getDisplayReadyAssingments(
    assignments ?? [],
    allPlanets ?? [],
    latestSnapshots,
    false
  );

  if (!blobPlanet) {
    return (
      <main className="grid grid-cols-[23%_77%] flex-1 divide-x divide-white">
        <AssignmentsAside assignments={displayReadyAssignments} />
        <div className="grid grid-cols-[95%_5%] w-full h-full">
          <div className="flex flex-col items-center justify-center">
            <span>There was an error when fetching the data</span>
          </div>
          <DispatchAside></DispatchAside>
        </div>
      </main>
    );
  }

  const filteredSnapshots = latestSnapshots.filter(
    (snapshot) =>
      snapshot.planetId === blobPlanet.id &&
      snapshot.eventId === blobPlanet.current_event
  );

  const progress =
    filteredSnapshots.length !== 0
      ? 100 -
        (filteredSnapshots[0]?.health / filteredSnapshots[0]?.maxHealth) * 100
      : blobPlanet.current_faction !== FactionIDs.HUMANS
      ? 0
      : 100;

  const parsedTarget: BlobTarget = {
    id: blobPlanet.id,
    name: blobPlanet.name,
    currentOwner: blobPlanet.current_faction,
    sector: blobPlanet.sector,
    playerCount: blobPlanet.player_count,
    progressPerHour: estimateHourlyRateForPlanet(filteredSnapshots).regression,
    regenPerHour: blobPlanet.latest_regen,
    event: blobPlanet.planet_event,
    progress,
  };

  return (
    <main className="grid grid-cols-[23%_77%] flex-1 divide-x divide-white max-h-svh">
      <AssignmentsAside assignments={displayReadyAssignments} />
      <div className="grid grid-cols-[95%_5%] w-full h-full">
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-2xl">The Blob has decreed</span>
          <div className="w-1/2">
            <BlobCard
              target={parsedTarget}
              totalPlayerCount={totalPlayerCount?.player_count ?? 0}
              locale={locale}
            ></BlobCard>
          </div>
          <span className="text-2xl">as your target</span>
          <span className="text-helldiver-yellow text-3xl">
            {blobPlanet?.player_count ?? "Unknown"}
          </span>
        </div>
        <DispatchAside></DispatchAside>
      </div>
    </main>
  );
}
