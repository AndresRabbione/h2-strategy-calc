import { useTranslations } from "next-intl";

export default function NoStrategy({
  hasAssignment,
}: {
  hasAssignment: boolean;
}) {
  const t = useTranslations("NoStrategy");
  return (
    <div className="h-full p-3 flex items-center justify-center">
      <p className="text-3xl font-semibold text-center">
        {hasAssignment ? t("has-assignments-msg") : t("no-assignments-msg")}
      </p>
    </div>
  );
}
