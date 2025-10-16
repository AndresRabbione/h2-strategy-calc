import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../database.types";
import { PlanetSnapshotFull } from "@/lib/typeDefinitions";
import {
  calcPlanetProgressPercentage,
  calcPlanetRegenPercentage,
} from "@/heldiversAPI/formulas";

export async function getLatestPlanetSnapshots(
  supabase: SupabaseClient<Database>
): Promise<PlanetSnapshotFull[]> {
  const { data: snapshots } = await supabase
    .from("progressSnapshot")
    .select("*")
    .gte("createdAt", new Date(Date.now() - 3600000).toISOString()); //One hour

  return snapshots ?? [];
}

export function estimateHourlyRateForPlanet(snapshots: PlanetSnapshotFull[]): {
  simple: number;
  regression: number;
} {
  if (snapshots.length < 2) return { simple: 0, regression: 0 };

  const regenPerHour = calcPlanetRegenPercentage(
    snapshots[snapshots.length - 1].regenPerSecond,
    snapshots[snapshots.length - 1].maxHealth
  );

  // normalize health %
  const points = snapshots.map((s) => ({
    t: new Date(s.createdAt).getTime() / 1000 / 60, // minutes since epoch
    p: calcPlanetProgressPercentage(s.health, s.maxHealth, null),
  }));

  const t0 = points[0].t;
  const normalized = points.map((p) => ({ t: p.t - t0, p: p.p })); // time since first snapshot in minutes

  // --- simple slope (start to end) ---
  const dtHours = (normalized.at(-1)!.t - normalized[0].t) / 60;
  const rateSimple = (normalized.at(-1)!.p - normalized[0].p) / dtHours;

  // --- regression slope (least squares) ---
  const n = normalized.length;
  const meanT = normalized.reduce((a, p) => a + p.t, 0) / n;
  const meanP = normalized.reduce((a, p) => a + p.p, 0) / n;
  let num = 0,
    den = 0;
  for (const { t, p } of normalized) {
    num += (t - meanT) * (p - meanP);
    den += (t - meanT) ** 2;
  }
  const slopePerMinute = num / den; // % per minute
  const rateRegression = slopePerMinute * 60; // % per hour

  return {
    simple: rateSimple + regenPerHour,
    regression: rateRegression + regenPerHour,
  };
}
