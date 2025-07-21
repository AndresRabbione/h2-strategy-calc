import { isUnderAttack } from "../API/gambits/route";
import { findPlanetById } from "../API/planets/route";
import {
  CollectionObjective,
  KillObjective,
  Objective,
  OperationObjective,
  PlanetObjective,
} from "./objectiveClasses";
import {
  Enemies,
  EnemyIds,
  FactionIDs,
  Factions,
  ItemIds,
  Items,
  Assignment,
  ObjectiveTypes,
  ParsedAssignment,
  Planet,
  SupplyLines,
  Task,
  ValueTypes,
  DSSStep,
  StrategyStep,
} from "./typeDefinitions";

export abstract class CalculatorStrategy {
  protected impactModifier: number;
  protected timeRemaining: number;
  protected targetedPlanets: Planet[];
  protected routeTable: SupplyLines;
  protected majorOrder: ParsedAssignment;
  protected opportunities: ParsedAssignment[];
  public DSSScript: DSSStep[];
  public ObjectiveScript: StrategyStep[];

  constructor(
    impact: number,
    timeLeft: number,
    routes: SupplyLines,
    majorOrder: ParsedAssignment,
    opportunities: ParsedAssignment[],
    targets: Planet[]
  ) {
    this.impactModifier = impact;
    this.timeRemaining = timeLeft;
    this.routeTable = routes;
    this.majorOrder = majorOrder;
    this.opportunities = opportunities;
    this.targetedPlanets = targets;
    this.DSSScript = [];
    this.ObjectiveScript = [];
  }

  protected calcMinOffense(planet: Planet): number {
    return planet.maxHealth / (this.timeRemaining - 1);
  }

  protected calcRouteResistance(planets: Planet[]): number {
    return planets.reduce(
      (accumulator, currentPlanet) =>
        accumulator + currentPlanet.regenPerSecond,
      0
    );
  }

  protected areTherePlanetsSpecified(): boolean {
    for (const assignment of this.parsedAssignments) {
      for (const objective of assignment.objectives) {
        if (objective.hasSpecificPlanet()) {
          return true;
        }
      }
    }

    return false;
  }

  protected async getAllRoutes(
    startingPlanet: Planet,
    currentRoute: Planet[] = [],
    visited: Set<number> = new Set()
  ): Promise<Planet[][]> {
    // Discarding the route when it crosses a disabled planet or finding a circular dependancy
    if (
      visited.has(startingPlanet.index) ||
      this.routeTable[startingPlanet.name.toUpperCase()].disabled
    )
      return [];

    // Adding the next planet in the route and marking it as seen
    const newRoute = [...currentRoute, startingPlanet];
    visited.add(startingPlanet.index);

    // The route is complete if it finds a plant under Super Earth control
    if (startingPlanet.currentOwner === Factions.HUMANS) {
      return [newRoute];
    }

    const linkedPlanets =
      this.routeTable[startingPlanet.name.toUpperCase()].links;

    // The route is invalid if there are no remaining links
    if (!linkedPlanets || linkedPlanets.length === 0) {
      return [];
    }

    let allRoutes: Planet[][] = [];

    // Searching recursivley for all the routes
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

    for (const linkedPlanet of linkedPlanets) {
      const fullPlanetData: Planet = await findPlanetById(linkedPlanet.index);

      const routes = await this.getAllRoutes(fullPlanetData);

      return routes;
    }

    return [];
  }

  protected calcMinPercentage(planet: Planet): number {
    const minOffense: number = this.calcMinOffense(planet);
    // TODO: Figure out the formula for the player weight
  }

  protected async findShortestRoute(planet: Planet): Promise<Planet[]> {
    const routes = await this.findAllRoutes(planet);
    const routesRegen: number[] = [];

    for (const route of routes) {
      const totalRegen = this.calcRouteResistance(route);

      routesRegen.push(totalRegen);
    }

    const index = routesRegen.indexOf(Math.min(...routesRegen));

    return routes[index];
  }

  protected async isPlanetAvailable(planet: Planet): Promise<boolean> {
    const linkedPlanets = this.routeTable[planet.name.toUpperCase()].links;

    for (const linkedPlanet of linkedPlanets) {
      const planetData = await findPlanetById(linkedPlanet.index);

      if (planetData.currentOwner === Factions.HUMANS) return true;
    }

    return false;
  }

  public getTargetedFactions(): Factions[] {
    let targetedFactions: Factions[] = [...this.majorOrder.targetFactions];

    for (const opportunity of this.opportunities) {
      targetedFactions = [...opportunity.targetFactions, ...targetedFactions];
    }

    return targetedFactions;
  }

  public abstract calculateOptimalStrategy(): void;
}

export class LiberationStrategy extends CalculatorStrategy {
  public calculateOptimalStrategy(): void {}
}

export class FactionStrategy extends CalculatorStrategy {}

export class NoMOStrategy extends CalculatorStrategy {
  constructor(impact: number, routes: SupplyLines) {
    super(impact, 0, routes, {} as ParsedAssignment, [], []);
  }

  public calculateOptimalStrategy(): void {
    return;
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

    return new PlanetObjective(
      progress === 1 && !(await isUnderAttack(target!.index)),
      ObjectiveTypes.HOLD,
      target!
    );
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

  public isValidAssignment(assignment: Assignment): boolean {
    return assignment.id32 !== -1;
  }
}

export class StrategyFactory {
  private majorOrderParser: MOParser;
  private currentMajorOrder: Assignment;
  private opportunities: Assignment[];

  constructor(currentOrder: Assignment, opportunities: Assignment[]) {
    this.currentMajorOrder = currentOrder;
    this.majorOrderParser = new MOParser();
    this.opportunities = opportunities;
  }

  public async generateNewStrategy(): Promise<CalculatorStrategy> {
    const parsedMO = await this.getParsedMO();
    if (!parsedMO) {
      return new NoMOStrategy();
    }
    return {} as CalculatorStrategy;
  }

  private async getParsedMO(): Promise<ParsedAssignment | null> {
    if (this.majorOrderParser.isValidAssignment(this.currentMajorOrder)) {
      return null;
    }

    const tasks = this.currentMajorOrder.setting.tasks;
    const progress = this.currentMajorOrder.progress;
    const objectives: Objective[] = [];
    const targetedFactions: Factions[] = [];
    for (let i = 0; i < progress.length; i++) {
      const parsedObj = await this.majorOrderParser.getParsedObjective(
        tasks[i],
        progress[i]
      );

      const currentFaction = parsedObj?.getTargetedFaction();

      if (currentFaction && !targetedFactions.includes(currentFaction)) {
        targetedFactions.push(currentFaction);
      }

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
      isMajorOrder: true,
      title: this.currentMajorOrder.setting.overrideTitle,
      brief: this.currentMajorOrder.setting.overrideBrief,
      targetFactions: targetedFactions,
    };
  }

  private async getParsedOpportunities(): Promise<ParsedAssignment[] | null> {
    const parsedOpportunities: ParsedAssignment[] = [];

    for (const opportunity of this.opportunities) {
      if (this.majorOrderParser.isValidAssignment(opportunity)) {
        const tasks = opportunity.setting.tasks;
        const progress = opportunity.progress;
        const objectives: Objective[] = [];
        const targetedFactions: Factions[] = [];

        for (let i = 0; i < progress.length; i++) {
          const parsedObj = await this.majorOrderParser.getParsedObjective(
            tasks[i],
            progress[i]
          );

          const currentFaction = parsedObj?.getTargetedFaction();

          if (currentFaction && !targetedFactions.includes(currentFaction)) {
            targetedFactions.push(currentFaction);
          }

          if (parsedObj !== null) {
            objectives.push(parsedObj);
          }
        }

        const endTime = Date.now() + opportunity.expiresIn * 1000;
        const endDate = new Date(endTime);

        parsedOpportunities.push({
          id: opportunity.id32,
          endDate: endDate,
          timeRemaining: opportunity.expiresIn * 1000,
          objectives: objectives,
          isMajorOrder: false,
          title: opportunity.setting.overrideTitle,
          brief: opportunity.setting.overrideBrief,
          targetFactions: targetedFactions,
        });
      }
    }

    return parsedOpportunities;
  }
}
