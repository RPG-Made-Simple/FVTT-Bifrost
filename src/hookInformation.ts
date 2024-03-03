/**
 * Hook types that can be used
 */
export enum HookType {
  Invalid,
  Attack,
  Item,
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
  }

  public constructor(init?: Partial<HookInformation>) {
    Object.assign(this, init);
  }
}
