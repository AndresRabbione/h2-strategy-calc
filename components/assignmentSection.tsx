"use client";

import { DisplayAssignment } from "@/lib/typeDefinitions";
import GenericObjective from "./genericObjective";
import { useTranslations } from "next-intl";

export default function AssignmentSection({
  assignment,
  locale,
}: {
  assignment: DisplayAssignment;
  locale: string;
}) {
  const t = useTranslations("AssignmentSection");

  return (
    <div className="flex flex-col gap-3">
      <span className="font-bold text-3xl text-center">{assignment.title}</span>
      <p className="text-pretty">{assignment.brief}</p>
      <div className="flex flex-col gap-3">
        {assignment.objectives.map((objecive, index) => {
          return (
            <div key={objecive.id}>
              {assignment.is_decision ? (
                <span>{`${t("decision-text")} #${index + 1}`}</span>
              ) : null}
              <GenericObjective
                locale={locale}
                objective={objecive}
              ></GenericObjective>
            </div>
          );
        })}
      </div>
    </div>
  );
}
