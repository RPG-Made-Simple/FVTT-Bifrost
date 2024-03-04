import { HookType } from "../hook_information";
import { HyperInformation } from "../hyper_information";
import { ItemInformation } from "../item_information";
import { SystemInformation } from "../system_information";
/**
 * Abstract class that provides an interface between the systems. To support a
 * system it is required to implement a Bridge for it. That requires manual work
 * on our part and should be always tested later.
 */
export declare abstract class BridgeAbstract {
    /**
     * Register the replicated methods
     * @param socket Instance of a socket from socketlib
     */
    abstract registerReplicated(socket: any): any;
    /**
     * Returns all the hooks useful for attack
     */
    abstract get attackHooks(): Array<{
        name: string;
        value: string;
    }>;
    /**
     * Returns all the hooks useful for items
     */
    abstract get itemHooks(): Array<{
        name: string;
        value: string;
    }>;
    /**
     * Returns all the hyper information about the bridge
     */
    abstract get hyperInformation(): HyperInformation;
    /**
     * Returns information specific to this system that can be useful
     */
    abstract get systemInformation(): SystemInformation;
    /**
     * Method that creates an item
     * @param targetUuid
     * @param items
     */
    _createItems(targetUuid: string, items: Array<any>): Promise<void>;
    /**
     * API method that creates an item
     * @param target
     * @param items
     */
    createItems(target: any, items: Array<any>): Promise<boolean>;
    /**
     * Method that delets an item
     * @param targetUuid
     * @param itemIds
     */
    _deleteItems(targetUuid: string, itemIds: Array<string>): Promise<void>;
    /**
     * API method that deletes an item
     * @param target
     * @param itemIds
     * @returns
     */
    deleteItems(target: any, itemIds: Array<string>): Promise<boolean>;
    /**
     * Method that extracts the basic information of an item
     * @param item
     * @returns
     */
    getBasicItemInformation(item: any): {
        name: any;
        owner: any;
        image: any;
    };
    /**
     * Method that extracts useful information from an item
     * @param item
     * @returns
     */
    abstract getItemInformation(item: any): ItemInformation;
    /**
     * Method that sets the information of an item
     * @param item
     * @param information
     */
    abstract setItemInformation(item: any, information: ItemInformation): any;
    /**
     * Method that is called when a hook is triggered and returns the information
     * that can be extract from it
     * @param workflow
     * @param source
     * @param from
     */
    abstract getHookInformation(workflow: Array<any>, source: HookType, from: string): any;
}
