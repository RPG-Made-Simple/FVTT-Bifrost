import { BridgeAbstract } from "./bridge/bridge_abstract";
/**
 * Here are all the constants used by the module, all static values and
 * constants should be defined here. These values will be used during the entire
 * execution of the module.
 */
export declare class Constants {
    /**
     * The id of the module.
     */
    static readonly ID = "bifrost";
    /**
     * The module's name without decorations.
     */
    static readonly NAME_FLAT = "Bifrost";
    /**
     * The module's name with decorations.
     */
    static readonly NAME: string;
    /**
     * Debugger instance.
     */
    static D: any;
    /**
     * Socket instance, from socketlib.
     */
    static SOCKET: any;
    /**
     * The current bridge being used, should not change during execution.
     */
    static CURRENT_BRIDGE: BridgeAbstract;
}
/**
 * Here are all the hooks that the module calls.
 */
export declare class ModuleHooks {
    /**
     * Called when the module begins its initialization.
     */
    static readonly INITIALIZING = "bifrost.init";
    /**
     * Called when the module is ready to be used.
     */
    static readonly READY = "bifrost.ready";
}
