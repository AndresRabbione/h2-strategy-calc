import { EnemyIds } from "@/lib/typeDefinitions";
import { getFactionNameFromId } from "./factions";
import { createClient } from "../supabase/server";
import { getTranslations } from "next-intl/server";

export async function parseEnemyId(
  enemyId: number,
  factionId: number | null
): Promise<{ id: number; name: string; faction: number }> {
  const t = await getTranslations("Enemies");

  if (factionId && enemyId === EnemyIds.ANY) {
    return {
      id: -1,
      name: await getFactionNameFromId(factionId, true),
      faction: factionId,
    };
  } else if (!factionId && enemyId === EnemyIds.ANY) {
    return { id: -1, name: t("any-enemy"), faction: 0 };
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("enemy")
      .select("*")
      .eq("id", enemyId)
      .single();
    return data ?? { id: -1, name: t("unknown-id"), faction: 0 };
  }
}
