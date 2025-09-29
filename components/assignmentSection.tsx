import { DisplayAssignment } from "@/lib/typeDefinitions";
import GenericObjective from "./genericObjective";
import { useTranslations } from "next-intl";

export default function AssignmentSection({
  assignment,
}: {
  assignment: DisplayAssignment;
}) {
  const t = useTranslations("AssignmentSection");

  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold text-3xl text-center">{assignment.title}</span>
      <p className="text-pretty">{assignment.brief}</p>
      {assignment.objectives.map((objecive) => (
        <GenericObjective
          key={objecive.id}
          objective={objecive}
        ></GenericObjective>
      ))}
    </div>
  );
}
