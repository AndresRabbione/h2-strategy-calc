import { useTranslations } from "next-intl";

export default function NoAssignments() {
  const t = useTranslations("NoAssignments");

  return (
    <div className="flex flex-col gap-3">
      <span className="font-bold text-3xl text-center">{t("title")}</span>
      <p className="text-pretty">{t("brief")}</p>
    </div>
  );
}
