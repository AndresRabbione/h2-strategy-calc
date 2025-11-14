"use client";

import { DisplayAssignment } from "@/lib/typeDefinitions";
import GenericObjective from "./genericObjective";
import { useTranslations } from "next-intl";
import AssignmentCountdown from "./assignmentCountdown";

export default function AssignmentSection({
  assignment,
}: {
  assignment: DisplayAssignment;
}) {
  const t = useTranslations("AssignmentSection");
  const now = Date.now();
  const assignmentEndDate = new Date(assignment.endDate);

  return (
    <div className="flex flex-col gap-3 w-full ">
      <div
        className={`flex flex-row items-center gap-2 ${
          assignmentEndDate.getTime() > now
            ? "justify-between"
            : "justify-center"
        }`}
      >
        <span className="font-bold text-3xl text-center">
          {assignment.title}
        </span>
        {assignmentEndDate.getTime() > now && (
          <AssignmentCountdown
            endDate={assignmentEndDate}
          ></AssignmentCountdown>
        )}
      </div>
      <p className="text-pretty">{assignment.brief}</p>
      <div className="flex flex-col gap-3">
        {assignment.objectives.map((objecive, index) => {
          return (
            <div key={objecive.id}>
              {assignment.is_decision ? (
                <span>{`${t("decision-text")} #${index + 1}`}</span>
              ) : null}
              <GenericObjective objective={objecive}></GenericObjective>
            </div>
          );
        })}
      </div>
    </div>
  );
}
