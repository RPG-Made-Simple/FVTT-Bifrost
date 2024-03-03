/**
 * Hook types that are used to inform the origin of a hook.
 */
export enum HookType {
  /**
   * Refers to a invalid state, when this enum is used you can safely assume
   * that the data ralated to it is invalid too.
   */
  Invalid = "INVALID",
  /**
   * The hook is related to attack rolls.
   */
  Attack = "ATTACK",
  /**
   * The hook is related to item rolls.
   */
  Item = "ITEM",
}

/**
 * Defines the information that can be extracted from the hooks.
 */
export class HookInformation {
  /**
   * The item that triggered the hook
   */
  public item: any = undefined;
  /**
   * The actor that triggered the hook
   */
  public actor: any = undefined;
  /**
   * The token that triggered the hook
   */
  public token: any = undefined;
  /**
   * The targets
   */
  public targets: Array<any> = new Array();
  /**
   * The targets that got hit
   */
  public hitTargets: Array<any> = new Array();
  /**
   * Type of the hook
   */
  public type: HookType = HookType.Invalid;
  /**
   * Dice information
   */
  public dice: {
    roll: number,
    total: number,
    critical: boolean,
    fumble: boolean,
  } = {
    roll: -1,
    total: -1,
    critical: false,
    fumble: false,
  }

  /**
   * Creates a new `HookInformation`, you can pass partial values to this
   * constructor, such as:
   * ```ts
   * let newhookInformation = new HookInformation({type: HookType.Attack});
   * ```
   * @param init Partial
   */
  public constructor(init?: Partial<HookInformation>) {
    Object.assign(this, init);
  }
}
