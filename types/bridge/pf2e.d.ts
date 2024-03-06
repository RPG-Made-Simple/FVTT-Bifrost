import { BridgeAbstract } from "./bridge_abstract";
import { ItemInformation } from "../item_information";
import { HookInformation, HookType } from "../hook_information";
import { HyperInformation } from "../hyper_information";
import { SystemInformation } from "../system_information";
/**
 * Bridge for Pathfinder 2e
 */
export declare class Pf2eBridge extends BridgeAbstract {
    get attackHooks(): {
        name: string;
        value: string;
    }[];
    get itemHooks(): {
        name: string;
        value: string;
    }[];
    get hyperInformation(): HyperInformation;
    get systemInformation(): SystemInformation;
    getItemInformation(item: any): ItemInformation;
    setItemInformation(item: any, information: ItemInformation): Promise<void>;
    getHookInformation(workflow: any, source: HookType, from: any): HookInformation;
}
