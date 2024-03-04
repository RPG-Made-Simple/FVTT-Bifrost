import { BridgeAbstract } from "./bridge_abstract";
import { HyperInformation } from "../hyper_information";
import { SystemInformation } from "../system_information";
import { ItemInformation } from "../item_information";
import { HookInformation, HookType } from "../hook_information";
/**
 * Bridge for DnD5e.
 */
export declare class DnD5eBridge extends BridgeAbstract {
    registerReplicated(socket: any): void;
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
    _createItems(targetUuid: string, items: Array<any>): Promise<void>;
    createItems(target: any, items: Array<any>): any;
    _deleteItems(targetUuid: string, itemIds: Array<string>): Promise<void>;
    deleteItems(target: any, itemIds: Array<string>): any;
    getItemInformation(item: any): ItemInformation;
    setItemInformation(item: any, information: ItemInformation): Promise<void>;
    getHookInformation(workflow: Array<any>, source: HookType, from: string): HookInformation;
}
