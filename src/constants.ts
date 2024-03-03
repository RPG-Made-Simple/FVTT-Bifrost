import { Bridge } from "./bridge";

/**
 * Here are all the constants used by the module, all static values and
 * constants should be defined here. These values will be used during the entire
 * execution of the module.
 */
export class Constants {
  /**
   * The id of the module
   */
  public static readonly ID = 'bifrost';
  /**
   * The module's name without decorations
   */
  public static readonly NAME_FLAT = 'Bifrost';
  /**
   * The module's name with decorations
   */
  public static readonly NAME = `🌈 ${Constants.NAME_FLAT}`;
  /**
   * Debugger instance
   */
  public static D;
  /**
   * Socket instance, from socketlib
   */
  public static SOCKET;
  /**
   * The current bridge being used, should not change during execution
   */
  public static CURRENT_BRIDGE: Bridge;
}

/**
 *
 */
export class ModuleHooks {
  public static readonly INITIALIZING = 'bifrost.init';
  public static readonly READY = 'bifrost.ready';
}
