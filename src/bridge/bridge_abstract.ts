import { Constants as C } from "../constants";
import { HookType } from "../hook_information";
import { HyperInformation } from "../hyper_information";
import { ItemInformation } from "../item_information";
import { SystemInformation } from "../system_information";

/**
 * Abstract class that provides an interface between the systems. To support a
 * system it is required to implement a Bridge for it. That requires manual work
 * on our part and should be always tested later.
 */
export abstract class BridgeAbstract {
  /**
   * Register the replicated methods
   * @param socket Instance of a socket from socketlib
   */
  registerReplicated(socket: any) {
    socket.register('createItems', this._createItems);
    socket.register('deleteItems', this._deleteItems);
  }

  /**
   * Returns all the hooks useful for attack
   */
  abstract get attackHooks() : Array<{name: string, value: string}>;

  /**
   * Returns all the hooks useful for items
   */
  abstract get itemHooks() : Array<{name: string, value: string}>;

  /**
   * Returns all the hyper information about the bridge
   */
  abstract get hyperInformation() : HyperInformation ;

  /**
   * Returns information specific to this system that can be useful
   */
  abstract get systemInformation() : SystemInformation;

  /**
   * Method that creates an item
   * @param targetUuid
   * @param items
   */
  async _createItems(targetUuid: string, items: Array<any>) {
    // Debug
    C.D.info('Bridge._createItems()');

    // Convert the target uuid into a valid actor
    // @ts-ignore
    const target = await fromUuid(targetUuid);

    await target.createEmbeddedDocuments('Item', items);
  }

  /**
   * API method that creates an item
   * @param target
   * @param items
   */
  async createItems(target: any, items: Array<any>) {
    // Debug
    C.D.info('Bridge.createItems()');

    // @ts-ignore
    const user = Toolbox.someoneWhoCanEdit(target);
    if (user) {
      // Pass the target uuid and the items to be created
      C.SOCKET.executeAsUser('createItems', user.id, target.uuid, items);

      return true;
    } else {
      // Debug
      C.D.error('No one can create the items');

      return false;
    }
  }

  /**
   * Method that delets an item
   * @param targetUuid
   * @param itemIds
   */
  async _deleteItems(targetUuid: string, itemIds: Array<string>) {
    // Debug
    C.D.info('Bridge._deleteItems()');

    // Convert the target uuid into a valid actor
    // @ts-ignore
    const target = await fromUuid(targetUuid);

    await target.deleteEmbeddedDocuments('Item', itemIds);
  }

  /**
   * API method that deletes an item
   * @param target
   * @param itemIds
   * @returns
   */
  async deleteItems(target: any, itemIds: Array<string>) {
    // Debug
    C.D.info('Bridge.deleteItems()');

    // @ts-ignore
    const user = Toolbox.someoneWhoCanEdit(target);
    if (user) {
      // Pass the target uuid and the items to be deleted
      C.SOCKET.executeAsUser('deleteItems', user.id, target.uuid, itemIds);

      return true;
    } else {
      // Debug
      C.D.error('No one can delete the items');

      return false;
    }
  }

  /**
   * Method that extracts the basic information of an item
   * @param item
   * @returns
   */
  getBasicItemInformation(item: any) {
    // Basic info
    const name = item.name;
    const owner = item.parent;
    const image = item.img;

    return {
      name,
      owner,
      image,
    }
  }

  /**
   * Method that extracts useful information from an item
   * @param item
   * @returns
   */
  abstract getItemInformation(item: any) : ItemInformation;

  /**
   * Method that sets the information of an item
   * @param item
   * @param information
   */
  abstract setItemInformation(item: any, information: ItemInformation);

  /**
   * Method that is called when a hook is triggered and returns the information
   * that can be extract from it
   * @param workflow
   * @param source
   * @param from
   */
  abstract getHookInformation(workflow: Array<any>, source: HookType, from: string);
}
