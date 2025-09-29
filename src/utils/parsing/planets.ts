import { createClient } from "../supabase/server";

export async function parsePlanetId(planetId: number): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("planet")
    .select("name")
    .eq("id", planetId)
    .single();

  return data?.name ?? "Unknown";
}
