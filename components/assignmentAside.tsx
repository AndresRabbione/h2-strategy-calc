import { DisplayAssignment } from "@/lib/typeDefinitions";
import AssignmentSection from "./assignmentSection";
import NoAssignments from "./noAssignment";

export default function AssignmentsAside({
  assignments,
  locale,
}: {
  assignments: DisplayAssignment[];
  locale: string;
}) {
  if (assignments.length === 0) {
    return (
      <aside className="flex flex-col basis-1/5 gap-5 w-full h-full p-3 pt-0 mt-3 col-span-1">
        <NoAssignments></NoAssignments>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col basis-1/5 gap-5 h-full p-3 pt-0 mt-3 col-span-1">
      <div className="flex flex-col gap-2 justify-center items-center">
        {assignments.map((assignment) => (
          <AssignmentSection
            key={assignment.id}
            assignment={assignment}
            locale={locale}
          ></AssignmentSection>
        ))}
      </div>
    </aside>
  );
}
