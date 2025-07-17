import { MOParser, PlanetObjective } from "@/app/lib/classDefinitions";
import { MajorOrder, MOSetting, Task } from "@/app/lib/typeDefinitions";
import { expect, jest } from "@jest/globals";

jest.mock("@/app/lib/typeDefinitions");

describe("getLatestMajorOrder", () => {
  let parser: MOParser;
  beforeEach(() => {
    parser = new MOParser();
  });
  it("should be an instance of MOParser", () => {
    expect(parser).toBeInstanceOf(MOParser);
  });

  it("isValidMO should return a true when given an MO with id not = -1", () => {
    const majorOrder: MajorOrder = {
      id32: 1,
      startTime: 2134,
      progress: [0, 0, 1],
      expiresIn: 1,
      setting: {} as MOSetting,
    };
    const result = parser.isValidAssignment(majorOrder);

    expect(result).toBe(true);
  });

  it("isValidMO should return a false when given an MO with id = -1", () => {
    const majorOrder: MajorOrder = {
      id32: -1,
      startTime: 2134,
      progress: [0, 0, 1],
      expiresIn: 1,
      setting: {} as MOSetting,
    };
    const result = parser.isValidAssignment(majorOrder);

    expect(result).toBe(false);
  });

  it("should return a PlanetObjective when parsing a Task with type = 13", async () => {
    const task: Task = {
      type: 13,
      values: [15],
      valueTypes: [12],
    };
    const result = await parser.getParsedObjective(task, 0);

    expect(result).toBeInstanceOf(PlanetObjective);
  });
});
