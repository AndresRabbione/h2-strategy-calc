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
      <aside className="flex flex-col gap-5 w-1/6 h-full p-3">
        <NoAssignments></NoAssignments>
      </aside>
    );
  }

  const majorOrders = assignments.filter(
    (assignment) => assignment.isMajorOrder
  );
  const opportunities = assignments.filter(
    (assignment) => !assignment.isMajorOrder
  );

  return (
    <aside className="flex flex-col gap-5 w-1/6 h-full p-3">
      <div className="flex flex-col gap-2 justify-center items-center">
        {majorOrders.map((assignment) => (
          <AssignmentSection
            key={assignment.id}
            assignment={assignment}
          ></AssignmentSection>
        ))}
      </div>
      {opportunities.length > 0 ? (
        <div className="flex flex-col gap-2 justify-center items-center">
          {opportunities.map((assignment) => (
            <AssignmentSection
              key={assignment.id}
              assignment={assignment}
            ></AssignmentSection>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
