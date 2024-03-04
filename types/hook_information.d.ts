/**
 * Hook types that are used to inform the origin of a hook.
 */
export declare enum HookType {
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
    Item = "ITEM"
}
/**
 * Defines the information that can be extracted from the hooks.
 */
export declare class HookInformation {
    /**
     * The item that triggered the hook
     */
    item: any;
    /**
     * The actor that triggered the hook
     */
    actor: any;
    /**
     * The token that triggered the hook
     */
    token: any;
    /**
     * The targets
     */
    targets: Array<any>;
    /**
     * The targets that got hit
     */
    hitTargets: Array<any>;
    /**
     * Type of the hook
     */
    type: HookType;
    /**
     * Dice information
     */
    dice: {
        roll: number;
        total: number;
        critical: boolean;
        fumble: boolean;
    };
    /**
     * Creates a new `HookInformation`, you can pass partial values to this
     * constructor, such as:
     * ```ts
     * let newHookInformation = new HookInformation({type: HookType.Attack});
     * ```
     * @param init Partial
     */
    constructor(init?: Partial<HookInformation>);
}
