import { getTranslations } from "next-intl/server";
import { createClient } from "../supabase/server";

export async function parseStratagemId(stratagemId: number): Promise<string> {
  const supabase = await createClient();
  const t = await getTranslations("Stratagem");
  const { data } = await supabase
    .from("stratagem")
    .select("name")
    .eq("id", stratagemId)
    .single();

  return data?.name ?? t("unknown-id");
}
