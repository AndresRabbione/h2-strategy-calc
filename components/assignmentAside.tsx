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
    <aside
      className="flex flex-col gap-5 p-3 col-span-1 min-h-0 h-full overflow-y-auto [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div className="flex flex-col gap-10 justify-start items-start w-full">
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
