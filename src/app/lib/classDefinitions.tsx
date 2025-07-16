import { JSX } from "react";
import { Attack, fetchAttacks } from "../API/gambits/route";
import { findPlanetById } from "../API/planets/route";
import {
  Enemies,
  EnemyIds,
  FactionIDs,
  Factions,
  ItemIds,
  Items,
  MajorOrder,
  ObjectiveTypes,
  ParsedMO,
  Planet,
  PriorityTable,
  SupplyLines,
  Task,
  ValueTypes,
} from "./typeDefinitions";
import ObjectiveProgressBar from "../../../components/objectiveProgressBar";
import DualObjectiveProgressBar from "../../../components/dualObjectiveProgressBar";

export abstract class Objective {
  completed: boolean;
  type: ObjectiveTypes;

  constructor(complete: boolean, type: ObjectiveTypes) {
    this.completed = complete;
    this.type = type;
  }

  public abstract getObjectiveVisual(): JSX.Element;
}

export class PlanetObjective extends Objective {
  target: Planet;

  constructor(
    complete: boolean,
    type: ObjectiveTypes.HOLD | ObjectiveTypes.LIBERATE,
    target: Planet
  ) {
    super(complete, type);
    this.target = target;
  }

  public getObjectiveVisual(): JSX.Element {
    const percentComplete: number =
      ((this.target.maxHealth - this.target.health) / this.target.maxHealth) *
      100;

    const factionColor: string =
      this.target.currentOwner === Factions.TERMINIDS
        ? "#fdc300"
        : this.target.currentOwner === Factions.AUTOMATONS
        ? "#fe6d6a"
        : this.target.currentOwner === Factions.ILLUMINATE
        ? "#ce64f8"
        : "#ffe711";
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-row">
          <div
            className={`${
              this.completed ? "bg-[--success]" : "bg-[#44464a]"
            } h-1 w-1 p-0.5 m-1 border-1 border-[#61605f] shadow-inner`}
          ></div>
          <span>
            {this.type == ObjectiveTypes.HOLD
              ? "Hold "
              : this.type === ObjectiveTypes.LIBERATE
              ? "Liberate "
              : "Defend "}
            <span className={`text-[${factionColor}]`}>
              {this.target.name + "."}
            </span>
          </span>
        </div>
        {!this.completed && (
          <ObjectiveProgressBar
            innerText={`(${percentComplete.toFixed(1)}%)`}
            factionColor={factionColor}
            percentage={percentComplete}
          />
        )}
      </div>
    );
  }
}

export class KillObjective extends Objective {
  faction: Factions | null;
  enemy: Enemies | null;
  planet: Planet | null;
  progress: number;
  totalAmount: number;

  constructor(
    faction: Factions | null = null,
    enemy: Enemies | null = null,
    planet: Planet | null = null,
    progress: number,
    total: number,
    complete: boolean
  ) {
    super(complete, ObjectiveTypes.KILL);
    this.faction = faction;
    this.enemy = enemy;
    this.totalAmount = total;
    this.planet = planet;
    this.progress = progress;
  }

  public getObjectiveVisual(): JSX.Element {
    const percentComplete: number = (this.progress / this.totalAmount) * 100;

    const factionColor: string =
      this.faction === Factions.TERMINIDS
        ? "#fdc300"
        : this.faction === Factions.AUTOMATONS
        ? "#fe6d6a"
        : this.faction === Factions.ILLUMINATE
        ? "#ce64f8"
        : "#ffe711";

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-row">
          <div
            className={`${
              this.completed ? "bg-[--success]" : "bg-[#44464a]"
            } h-1 w-1 p-0.5 m-1 border-1 border-[#61605f] shadow-inner`}
          ></div>
          <span>
            Kill
            <span className={`text-[--helldiver-yellow]`}>
              {this.totalAmount}
            </span>
            <span className={`text-[${factionColor}]`}>
              {this.faction && !this.enemy
                ? this.faction + "."
                : this.enemy
                ? this.enemy + "s."
                : "enemies."}
            </span>
          </span>
        </div>
        {!this.completed && (
          <ObjectiveProgressBar
            innerText={`${this.progress} / ${
              this.totalAmount
            } (${percentComplete.toFixed(1)}%)`}
            factionColor={factionColor}
            percentage={percentComplete}
          />
        )}
      </div>
    );
  }
}

export class CollectionObjective extends Objective {
  faction: Factions | null;
  planet: Planet | null;
  item: Items;
  progress: number;
  totalAmount: number;

  constructor(
    completed: boolean,
    faction: Factions | null = null,
    planet: Planet | null = null,
    item: number,
    progress: number,
    total: number
  ) {
    super(completed, ObjectiveTypes.COLLECT);
    this.faction = faction;
    this.item = item;
    this.progress = progress;
    this.planet = planet;
    this.totalAmount = total;
  }

  public getObjectiveVisual(): JSX.Element {
    const percentComplete: number = (this.progress / this.totalAmount) * 100;

    const factionColor: string =
      this.faction === Factions.TERMINIDS
        ? "#fdc300"
        : this.faction === Factions.AUTOMATONS
        ? "#fe6d6a"
        : this.faction === Factions.ILLUMINATE
        ? "#ce64f8"
        : "#ffe711";

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-row">
          <div
            className={`${
              this.completed ? "bg-[--success]" : "bg-[#44464a]"
            } h-1 w-1 p-0.5 m-1 border-1 border-[#61605f] shadow-inner`}
          ></div>
          <span>
            Collect
            <span className={`text-[--helldiver-yellow]`}>
              {this.totalAmount}
            </span>
            <span className={`text-[--helldiver-yellow]`}>
              {this.item + "s" + this.faction && this.planet ? "" : "."}
            </span>
            {this.faction && (
              <span className={`text-[${factionColor}]`}>
                against the {this.faction + !this.planet ? "." : ""}
              </span>
            )}
            {this.planet && (
              <span className={`text-[${factionColor}]`}>
                on {this.planet.name + "."}
              </span>
            )}
          </span>
        </div>
        {!this.completed && (
          <ObjectiveProgressBar
            innerText={`${this.progress} / ${
              this.totalAmount
            } (${percentComplete.toFixed(1)}%)`}
            factionColor={factionColor}
            percentage={percentComplete}
          />
        )}
      </div>
    );
  }
}

export class DefendAmountObjective extends Objective {
  faction: Factions | null;
  totalAmount: number;
  progress: number;

  constructor(
    complete: boolean,
    faction: Factions | null = null,
    total: number,
    progress: number
  ) {
    super(complete, ObjectiveTypes.DEFEND_AMOUNT);
    this.faction = faction;
    this.totalAmount = total;
    this.progress = progress;
  }

  public getObjectiveVisual(): JSX.Element {
    const percentComplete: number = (this.progress / this.totalAmount) * 100;

    const factionColor: string =
      this.faction === Factions.TERMINIDS
        ? "#fdc300"
        : this.faction === Factions.AUTOMATONS
        ? "#fe6d6a"
        : this.faction === Factions.ILLUMINATE
        ? "#ce64f8"
        : "#ffe711";

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-row">
          <div
            className={`${
              this.completed ? "bg-[--success]" : "bg-[#44464a]"
            } h-1 w-1 p-0.5 m-1 border-1 border-[#61605f] shadow-inner`}
          ></div>
          <span>
            Successfully defend
            <span className={`text-[--helldiver-yellow]`}>
              {this.totalAmount}
            </span>
            <span>planets.</span>
          </span>
        </div>
        {!this.completed && (
          <ObjectiveProgressBar
            innerText={`${this.progress} / ${
              this.totalAmount
            } (${percentComplete.toFixed(1)}%)`}
            factionColor={factionColor}
            percentage={percentComplete}
          />
        )}
      </div>
    );
  }
}

export class OperationObjective extends Objective {
  difficulty: number | null;
  totalAmount: number;
  progress: number;
  faction: Factions | null;
  planet: Planet | null;
  difficultyTable: string[];

  constructor(
    completed: boolean,
    difficulty: number | null,
    total: number,
    progress: number,
    faction: Factions | null = null,
    planet: Planet | null = null
  ) {
    super(completed, ObjectiveTypes.OPERATIONS);
    this.difficulty = difficulty;
    this.totalAmount = total;
    this.faction = faction;
    this.planet = planet;
    this.progress = progress;
    this.difficultyTable = [
      "Trivial",
      "Easy",
      "Medium",
      "Challenging",
      "Hard",
      "Extreme",
      "Suicide Mission",
      "Impossible",
      "Helldive",
      "Super Helldive",
    ];
  }

  public getObjectiveVisual(): JSX.Element {
    const percentComplete: number = (this.progress / this.totalAmount) * 100;

    const factionColor: string =
      this.faction === Factions.TERMINIDS
        ? "#fdc300"
        : this.faction === Factions.AUTOMATONS
        ? "#fe6d6a"
        : this.faction === Factions.ILLUMINATE
        ? "#ce64f8"
        : "#ffe711";

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-row">
          <div
            className={`${
              this.completed ? "bg-[--success]" : "bg-[#44464a]"
            } h-1 w-1 p-0.5 m-1 border-1 border-[#61605f] shadow-inner`}
          ></div>
          <span>
            Complete
            <span className="text-[--helldiver-yellow]">
              {this.totalAmount}
            </span>
            <span>of Operations</span>
            {this.difficulty && (
              <span>
                on difficulty{" "}
                <span className="text-[--helldiver-yellow]">
                  {this.difficultyTable[this.difficulty] +
                    " or higher" +
                    !this.faction && !this.planet
                    ? "."
                    : ""}
                </span>
              </span>
            )}
            {this.faction && (
              <span className={`text-[${factionColor}]`}>
                against the {this.faction + !this.planet ? "." : ""}
              </span>
            )}
            {this.planet && (
              <span className={`text-[${factionColor}]`}>
                on {this.planet.name + "."}
              </span>
            )}
          </span>
        </div>
        {!this.completed && (
          <ObjectiveProgressBar
            innerText={`${this.progress} / ${
              this.totalAmount
            } (${percentComplete.toFixed(1)}%)`}
            factionColor={factionColor}
            percentage={percentComplete}
          />
        )}
      </div>
    );
  }
}

export class LiberateMoreObjective extends Objective {
  faction: Factions | null;
  liberatedPlanetCount: number;
  lostPlanetCount: number;

  constructor(
    completed: boolean,
    faction: Factions | null = null,
    liberatedCount: number,
    lostCount: number
  ) {
    super(completed, ObjectiveTypes.LIBERATE_MORE);
    this.faction = faction;
    this.liberatedPlanetCount = liberatedCount;
    this.lostPlanetCount = lostCount;
  }

  public getObjectiveVisual(): JSX.Element {
    const factionColor: string =
      this.faction === Factions.TERMINIDS
        ? "#fdc300"
        : this.faction === Factions.AUTOMATONS
        ? "#fe6d6a"
        : this.faction === Factions.ILLUMINATE
        ? "#ce64f8"
        : "#ffe711";

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-row">
          <div
            className={`${
              this.completed ? "bg-[--success]" : "bg-[#44464a]"
            } h-1 w-1 p-0.5 m-1 border-1 border-[#61605f] shadow-inner`}
          ></div>
          <span>
            Liberate more planets
            {this.faction && (
              <span className={`text-[${factionColor}]`}>
                from the {this.faction}
              </span>
            )}
            than are lost.
          </span>
        </div>
        {!this.completed && (
          <DualObjectiveProgressBar
            factionColor={factionColor}
            friendlyCount={this.liberatedPlanetCount}
            enemyCount={this.lostPlanetCount}
          />
        )}
      </div>
    );
  }
}

export abstract class CalculatorStrategy {
  //TODO: Update to new API specifications, specifically for Attacks
  protected priorityTable: PriorityTable;
  protected impactModifier: number;
  protected timeLimit: number;
  protected targetedPlanetIds: number[];
  protected routeTable: SupplyLines;
  protected parsedMO: ParsedMO;

  constructor(
    table: PriorityTable,
    impact: number,
    time: number,
    ids: number[],
    routes: SupplyLines,
    majorOrder: ParsedMO
  ) {
    this.priorityTable = table;
    this.impactModifier = impact;
    this.timeLimit = time;
    this.targetedPlanetIds = ids;
    this.routeTable = routes;
    this.parsedMO = majorOrder;
  }

  protected abstract calcMinOffense(planet: Planet): number;
  protected abstract calcRouteResistance(planets: Planet[]): number;
  protected async getAllRoutes(
    startingPlanet: Planet,
    currentRoute: Planet[] = [],
    visited: Set<number> = new Set()
  ): Promise<Planet[][]> {
    if (
      visited.has(startingPlanet.index) ||
      this.routeTable[startingPlanet.name.toUpperCase()].disabled
    )
      return [];

    const newRoute = [...currentRoute, startingPlanet];
    visited.add(startingPlanet.index);

    if (startingPlanet.currentOwner === Factions.HUMANS) {
      return [newRoute];
    }

    const linkedPlanets =
      this.routeTable[startingPlanet.name.toUpperCase()].links;

    if (!linkedPlanets || linkedPlanets.length === 0) {
      return [];
    }

    let allRoutes: Planet[][] = [];

    for (const link of linkedPlanets) {
      const nextPlanet = await findPlanetById(link.index);
      if (!nextPlanet) continue;
      const routes = await this.getAllRoutes(
        nextPlanet,
        newRoute,
        new Set(visited)
      );
      allRoutes = allRoutes.concat(routes);
    }

    return allRoutes;
  }

  protected async findAllRoutes(planet: Planet): Promise<Planet[][]> {
    const linkedPlanets: { name: string; index: number }[] =
      this.routeTable[planet.name.toUpperCase()].links;
    const allRoutes: Planet[][] = [];

    for (const linkedPlanet of linkedPlanets) {
      const fullPlanetData: Planet = await findPlanetById(linkedPlanet.index);

      const routes = await this.getAllRoutes(fullPlanetData);

      routes.forEach((route) => {
        if (route.length > 0) {
          if (route.length > 1) {
            route.pop();
          }
          allRoutes.push(route);
        }
      });
    }

    return allRoutes;
  }

  protected async findAllGambits(): Promise<Planet[][]> {
    const attacks: Attack[] | undefined = await fetchAttacks();
    if (!attacks) return [];
    const moGambits = [];

    for (const attack of attacks) {
      if (
        this.targetedPlanetIds.includes(attack.sourceId) ||
        this.targetedPlanetIds.includes(attack.targetId)
      ) {
        const source = await findPlanetById(attack.sourceId);
        const target = await findPlanetById(attack.targetId);
        if (Object.keys(source).length > 0 && Object.keys(target).length > 0) {
          moGambits.push([source, target]);
        }
      }
    }

    return moGambits;
  }

  public abstract calcMinPercentage(planet: Planet): number;

  public async findShortestRoute(planet: Planet): Promise<Planet[]> {
    const routes = await this.findAllRoutes(planet);
    const routesRegen: number[] = [];

    for (const route of routes) {
      const totalRegen = this.calcRouteResistance(route);

      routesRegen.push(totalRegen);
    }

    const index = routesRegen.indexOf(Math.min(...routesRegen));

    return routes[index];
  }

  public async isPlanetAvailable(planet: Planet): Promise<boolean> {
    const linkedPlanets = this.routeTable[planet.name.toUpperCase()].links;

    for (const linkedPlanet of linkedPlanets) {
      const planetData = await findPlanetById(linkedPlanet.index);

      if (planetData.currentOwner === Factions.HUMANS) return true;
    }

    return false;
  }
}

export class LiberationStrategy extends CalculatorStrategy {
  protected calcMinOffense(planet: Planet): number {
    return planet.maxHealth / (this.timeLimit - 1);
  }
  protected calcRouteResistance(planets: Planet[]): number {
    return planets.reduce(
      (accumulator, currentPlanet) =>
        accumulator + currentPlanet.regenPerSecond,
      0
    );
  }
  public calcMinPercentage(planet: Planet): number {
    const minOffense: number = this.calcMinOffense(planet);
    // TODO: Figure out the formula for the player weight
  }
}

export class MOParser {
  private parseFactionId(factionId: number): Factions {
    switch (factionId) {
      case FactionIDs.HUMANS:
        return Factions.HUMANS;
        break;
      case FactionIDs.TERMINIDS:
        return Factions.TERMINIDS;
        break;
      case FactionIDs.AUTOMATONS:
        return Factions.AUTOMATONS;
        break;
      case FactionIDs.ILLUMINATE:
        return Factions.HUMANS;
        break;
      default:
        return Factions.HUMANS;
        break;
    }
  }

  private parseEnemyId(enemyId: number): Enemies {
    switch (enemyId) {
      case EnemyIds.BILE_TITAN:
        return Enemies.BILE_TITAN;
        break;
      case EnemyIds.CHARGER:
        return Enemies.CHARGER;
        break;
      case EnemyIds.HULK:
        return Enemies.HULK;
        break;
      default:
        return Enemies.CHARGER;
        break;
    }
  }

  private parseItemId(itemId: number): Items {
    switch (itemId) {
      case ItemIds.COMMON:
        return Items.COMMON;
        break;
      case ItemIds.RARE:
        return Items.RARE;
        break;
      case ItemIds.SUPER_RARE:
        return Items.SUPER_RARE;
        break;
      default:
        return Items.COMMON;
        break;
    }
  }

  private async parsePlanetObj(
    objective: Task,
    progress: number
  ): Promise<Objective> {
    let target: Planet;

    for (let i = 0; i < objective.values.length; i++) {
      if (objective.valueTypes[i] === ValueTypes.PLANET_ID) {
        target = await findPlanetById(objective.values[i]);
      }
    }

    return new PlanetObjective(progress === 1, ObjectiveTypes.HOLD, target!);
  }

  private async parseOperationObj(
    objective: Task,
    progress: number
  ): Promise<Objective> {
    let complete: boolean = false;
    let difficulty: number | null = null;
    let faction: Factions | null = null;
    let planet: Planet | null = null;
    let total: number = 0;

    for (let i = 0; i < objective.values.length; i++) {
      switch (objective.valueTypes[i]) {
        case ValueTypes.AMOUNT:
          total = objective.values[i];
          complete = progress >= objective.values[i];
          break;
        case ValueTypes.DIFFICULTY:
          difficulty = objective.values[i];
          break;
        case ValueTypes.PLANET_ID:
          planet = await findPlanetById(objective.values[i]);
          break;
        case ValueTypes.TARGET_FACTION:
          faction = this.parseFactionId(objective.values[i]);
          break;
        default:
          break;
      }
    }

    return new OperationObjective(
      complete,
      difficulty,
      total,
      progress,
      faction,
      planet
    );
  }

  private async parseKillObj(
    objective: Task,
    progress: number
  ): Promise<Objective> {
    let complete: boolean = false;
    let faction: Factions | null = null;
    let enemy: number | null = null;
    let planet: Planet | null = null;
    let total: number = 0;

    for (let i = 0; i < objective.values.length; i++) {
      switch (objective.valueTypes[i]) {
        case ValueTypes.AMOUNT:
          total = objective.values[i];
          complete = progress >= objective.values[i];
          break;
        case ValueTypes.TARGET_FACTION:
          faction = this.parseFactionId(objective.values[i]);
          break;
        case ValueTypes.ENEMY:
          //TODO: This needs to be changed once enemyIDS are known
          enemy = this.parseEnemyId(objective.values[i]);
          break;
        case ValueTypes.PLANET_ID:
          planet = await findPlanetById(objective.values[i]);
          break;
      }
    }

    return new KillObjective(faction, enemy, planet, progress, total, complete);
  }

  private async parseCollectionObj(
    objective: Task,
    progress: number
  ): Promise<Objective> {
    let complete: boolean = false;
    let faction: Factions | null = null;
    let item: Items = Items.COMMON;
    let planet: Planet | null = null;
    let total: number = 0;

    for (let i = 0; i < objective.values.length; i++) {
      switch (objective.valueTypes[i]) {
        case ValueTypes.AMOUNT:
          total = objective.values[i];
          complete = progress >= objective.values[i];
          break;
        case ValueTypes.TARGET_FACTION:
          faction = this.parseFactionId(objective.values[i]);
          break;
        case ValueTypes.ITEM:
          //TODO: This needs to be changed once enemyIDS are known
          item = this.parseItemId(objective.values[i]);
          break;
        case ValueTypes.PLANET_ID:
          planet = await findPlanetById(objective.values[i]);
          break;
      }
    }

    return new CollectionObjective(
      complete,
      faction,
      planet,
      item,
      progress,
      total
    );
  }

  public async getParsedObjective(
    objective: Task,
    progress: number
  ): Promise<Objective | null> {
    switch (objective.type) {
      case ObjectiveTypes.HOLD:
        return await this.parsePlanetObj(objective, progress);
        break;
      case ObjectiveTypes.OPERATIONS:
        return await this.parseOperationObj(objective, progress);
        break;
      case ObjectiveTypes.COLLECT:
        return await this.parseCollectionObj(objective, progress);
        break;
      case ObjectiveTypes.DEFEND_AMOUNT:
        break;
      case ObjectiveTypes.KILL:
        return this.parseKillObj(objective, progress);
        break;
      case ObjectiveTypes.LIBERATE:
        break;
    }

    return null;
  }

  public isValidMO(majorOrder: MajorOrder): boolean {
    return majorOrder.id32 !== -1;
  }
}

export class StrategyFactory {
  private majorOrderParser: MOParser;
  private currentMajorOrder: MajorOrder;

  constructor(currentOrder: MajorOrder) {
    this.currentMajorOrder = currentOrder;
    this.majorOrderParser = new MOParser();
  }

  public async generateNewStrategy(): Promise<CalculatorStrategy> {
    return {} as CalculatorStrategy;
  }

  private async getParsedMO(): Promise<ParsedMO | null> {
    if (this.majorOrderParser.isValidMO(this.currentMajorOrder)) {
      return null;
    }

    const tasks = this.currentMajorOrder.setting.tasks;
    const progress = this.currentMajorOrder.progress;
    const objectives: Objective[] = [];
    for (let i = 0; i < progress.length; i++) {
      const parsedObj = await this.majorOrderParser.getParsedObjective(
        tasks[i],
        progress[i]
      );

      if (parsedObj !== null) {
        objectives.push(parsedObj);
      }
    }

    const endTime = Date.now() + this.currentMajorOrder.expiresIn * 1000;
    const endDate = new Date(endTime);

    return {
      id: this.currentMajorOrder.id32,
      endDate: endDate,
      timeRemaining: this.currentMajorOrder.expiresIn * 1000,
      objectives: objectives,
    };
  }
}
