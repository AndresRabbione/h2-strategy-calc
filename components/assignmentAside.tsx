import { DisplayAssignment } from "@/lib/typeDefinitions";
import AssignmentSection from "./assignmentSection";
import NoAssignments from "./noAssignment";

export default function AssignmentsAside({
  assignments,
}: {
  assignments: DisplayAssignment[];
}) {
  if (assignments.length === 0) {
    return (
      <aside className="flex flex-col gap-5 h-full p-3 col-span-1">
        <NoAssignments></NoAssignments>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col gap-5 h-full p-3 col-span-1">
      <div className="flex flex-col gap-2 justify-center items-center">
        {assignments.map((assignment) => (
          <AssignmentSection
            key={assignment.id}
            assignment={assignment}
          ></AssignmentSection>
        ))}
      </div>
    </aside>
  );
}
