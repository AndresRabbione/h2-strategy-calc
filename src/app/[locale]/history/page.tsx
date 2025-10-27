import { FullParsedAssignment, ObjectiveTypes } from "@/lib/typeDefinitions";
import { createClient } from "@/utils/supabase/server";
import SearchBar from "../../../../components/searchBar";
import AssignmentFilter from "../../../../components/filter";
import Pagination from "../../../../components/pagination";
import OrderButton from "../../../../components/orderButton";
import Link from "next/link";
import { getParsedDBObjectiveText } from "@/utils/parsing/objectives";

function filterSearchResults(
  filter: string,
  fetchedAssignments: FullParsedAssignment[]
): FullParsedAssignment[][] {
  const groupedAssignments = fetchedAssignments!.reduce(
    (groups: FullParsedAssignment[][], assignment) => {
      const latestGroup = groups[groups.length - 1] ?? [];

      if (latestGroup.length === 0) {
        groups.push([assignment]);
        return groups;
      }

      const currentStart = new Date(assignment.start_date).getTime();
      const currentEnd = new Date(assignment.actual_end_date!).getTime();

      const isParallel = latestGroup.some((assignmentInGroup) => {
        const groupAssignmentStart = new Date(
          assignmentInGroup.start_date
        ).getTime();
        const groupAssignmentEnd = new Date(
          assignmentInGroup.actual_end_date!
        ).getTime();

        return (
          (currentStart < groupAssignmentEnd &&
            groupAssignmentStart < currentEnd) ||
          currentStart === groupAssignmentStart
        );
      });

      if (isParallel) {
        latestGroup.push(assignment);
      } else {
        groups.push([assignment]);
      }

      return groups;
    },
    []
  );

  // Filter logic applied before pagination
  let finalAssignments = groupedAssignments;
  switch (filter) {
    case "won":
      finalAssignments = finalAssignments.filter((assignments) => {
        return assignments.some((assingment) => {
          return assingment.objective.every((obj) => {
            if (obj.type === ObjectiveTypes.LIBERATE_MORE) {
              return obj.playerProgress > obj.enemyProgress!;
            }

            return obj.totalAmount
              ? obj.playerProgress >= obj.totalAmount
              : obj.playerProgress >= 100;
          });
        });
      });
      break;
    case "lost":
      finalAssignments = finalAssignments.filter((assignments) => {
        return assignments.some((assingment) => {
          return assingment.objective.some((obj) => {
            if (obj.type === ObjectiveTypes.LIBERATE_MORE) {
              return obj.playerProgress < obj.enemyProgress!;
            }

            return obj.totalAmount
              ? obj.playerProgress < obj.totalAmount
              : obj.playerProgress < 100;
          });
        });
      });
      break;
    case "grouped":
      finalAssignments = finalAssignments.filter(
        (assignments) => assignments.length > 1
      );
      break;
    case "ungrouped":
      finalAssignments = finalAssignments.filter(
        (assignments) => assignments.length === 1
      );
      break;
  }

  return finalAssignments;
}

export default async function HistoryMainPage(props: {
  searchParams?: Promise<{
    page?: string;
    filter?: string;
    search?: string;
    order?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page ?? 0);
  const filter = searchParams?.filter ?? "all";
  const searchString = searchParams?.search?.toLowerCase() ?? "";
  const order = searchParams?.order ?? "desc";
  const limit = 5;

  const currentVerifiedParams = new URLSearchParams({
    page: currentPage.toString(),
    filter,
    search: searchString,
    order,
  });

  const supabase = await createClient();
  const { data: assignments } = await supabase
    .from("assignment")
    .select("*, objective(*)")
    .eq("is_active", false)
    .order("start_date", { ascending: order === "asc" });

  const searchedResults = assignments?.filter((assignment) => {
    return (
      assignment.title?.toLowerCase().includes(searchString) ||
      assignment.brief?.toLowerCase().includes(searchString) ||
      assignment.objective.some((objective) =>
        objective.parsed_text.toLowerCase().includes(searchString)
      )
    );
  });

  const filteredResults = filterSearchResults(filter, searchedResults ?? []);

  const paginatedGroups = filteredResults.slice(
    currentPage * limit,
    (currentPage + 1) * limit
  );

  paginatedGroups.forEach((group) =>
    group.sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )
  );

  const lastPagedIndex = (currentPage + 1) * limit - 1;

  return (
    <main className="p-3 bg-[#5b657a] flex-1 flex flex-col">
      <h1 className="text-3xl font-semibold pl-3">Previous Major Orders</h1>
      <div className="flex flex-col flex-1 h-full">
        <div className="flex flex-row justify-between items-center w-full">
          <Pagination
            hasNext={lastPagedIndex < filteredResults.length - 1}
            searchParamsString={currentVerifiedParams.toString()}
          ></Pagination>
          <OrderButton
            disabled={false}
            searchParamsString={currentVerifiedParams.toString()}
          ></OrderButton>
          <AssignmentFilter
            disabled={false}
            searchParamsString={currentVerifiedParams.toString()}
          ></AssignmentFilter>
          <SearchBar
            disabled={false}
            searchParamsString={currentVerifiedParams.toString()}
          ></SearchBar>
        </div>
        <div className="flex flex-col gap-5 h-full flex-1">
          {paginatedGroups.length > 0 ? (
            paginatedGroups.map((group, index) => {
              const lastGroupEndTime = Math.max(
                ...group.map((assignment) =>
                  new Date(assignment.actual_end_date!).getTime()
                )
              );

              return (
                <Link
                  className="flex flex-col gap-7 p-3 shadow-lg bg-[#131519]"
                  href={`/history/${group
                    .map((asignment) => asignment.id)
                    .join("/")}`}
                  key={index}
                >
                  <span>{`From ${new Date(
                    group[0].start_date
                  ).toLocaleDateString()} to ${new Date(
                    lastGroupEndTime
                  ).toLocaleDateString()}`}</span>
                  {group.map((assignment) => {
                    assignment.objective.sort(
                      (a, b) => a.objectiveIndex - b.objectiveIndex
                    );

                    const isSuccessful = assignment.objective.every(
                      (objective) => {
                        if (objective.type === ObjectiveTypes.LIBERATE_MORE) {
                          return (
                            objective.playerProgress > objective.enemyProgress!
                          );
                        }

                        return objective.totalAmount
                          ? objective.playerProgress >= objective.totalAmount
                          : objective.playerProgress >= 100;
                      }
                    );

                    return (
                      <div key={assignment.id} className="flex flex-col gap-3">
                        <div className="flex flex-row gap-3">
                          <h3>{assignment.title}</h3>
                          {isSuccessful ? (
                            <i
                              className={`rounded-full h-6 text-center w-6 bg-green-800 text-black pr-1`}
                            >
                              &#10003;
                            </i>
                          ) : (
                            <i className="rounded-full h-6 w-6 text-center bg-red-800 text-black pr-1">
                              &times;
                            </i>
                          )}
                        </div>
                        <p>{assignment.brief}</p>
                        <div className="flex flex-row justify-center items-center gap-8 self-center">
                          {assignment.objective.map((objective) => {
                            const parsedObjectiveText =
                              getParsedDBObjectiveText(objective.parsed_text);

                            return (
                              <p key={objective.id} className="text-center">
                                {parsedObjectiveText.map((fragment, index) => (
                                  <span
                                    style={{
                                      color: fragment.color
                                        ? fragment.color
                                        : "inherit",
                                    }}
                                    key={`obj-${objective.id}-${index}`}
                                  >
                                    {index === parsedObjectiveText.length - 1
                                      ? fragment.text
                                      : `${fragment.text} `}
                                  </span>
                                ))}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </Link>
              );
            })
          ) : (
            <div className="text-3xl flex flex-1 items-center justify-center font-semibold">
              No Orders Found
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
