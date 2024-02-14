////////////////////////////////////////////////////////////////////////////////
//                     ____  _  __               _                            //
//                    |  _ \(_)/ _|             | |                           //
//                    | |_) |_| |_ _ __ ___  ___| |_                          //
//                    |  _ <| |  _| '__/ _ \/ __| __|                         //
//                    | |_) | | | | | | (_) \__ \ |_                          //
//                    |____/|_|_| |_|  \___/|___/\__| LIBRARY                 //
//                                                      By ZotyDev            //
////////////////////////////////////////////////////////////////////////////////
// ? Generic class that provides a interface between the systems. To support a
// ? system it is required to implement a Bridge for it.
import { Constants as C } from "./constants.js";

export class Bridge {
  constructor() {
    if (this.constructor == Bridge) {
      throw new Error('Instance of Abstract class cannot be instantiazed');
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Register the replicated methods
  ////////////////////////////////////////////////////////////////////////////
  static registerReplicated(socket) {
    if (this.constructor == Bridge) {
      throw new Error('Abstract method not implemented');
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Returns all the useful hooks for attack
  ////////////////////////////////////////////////////////////////////////////
  static get attackHooks() {
    if (this.constructor == Bridge) {
      throw new Error('Abstract method not implemented');
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Returns all the useful hooks for items
  ////////////////////////////////////////////////////////////////////////////
  static get itemHooks() {
    if (this.constructor == Bridge) {
      throw new Error('Abstract method not implemented');
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Returns all the hyper information about the bridge
  ////////////////////////////////////////////////////////////////////////////
  static get hyperInformation() {
    if (this.constructor == Bridge) {
      throw new Error('Abstract method not implemented');
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Returns useful system information
  ////////////////////////////////////////////////////////////////////////////
  static get systemInformation() {
    if (this.constructor == Bridge) {
      throw new Error('Abstract method not implemented');
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Method that creates an item
  ////////////////////////////////////////////////////////////////////////////
  static async _createItems(targetUuid, items) {
    // Debug
    C.D.info('Bridge._createItems()');

    // Convert the target uuid into a valid actor
    const target = await fromUuid(targetUuid);

    await target.createEmbeddedDocuments('Item', items);
  }

  ////////////////////////////////////////////////////////////////////////////
  // API method that creates an item
  ////////////////////////////////////////////////////////////////////////////
  static async createItems(target, items) {
    // Debug
    C.D.info('Bridge.createItems()');

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

  ////////////////////////////////////////////////////////////////////////////
  // Method that deletes an item
  ////////////////////////////////////////////////////////////////////////////
  static async _deleteItems(targetUuid, itemIds) {
    // Debug
    C.D.info('Bridge._deleteItems()');

    // Convert the target uuid into a valid actor
    const target = await fromUuid(targetUuid);

    await target.deleteEmbeddedDocuments('Item', itemIds);
  }

  ////////////////////////////////////////////////////////////////////////////
  // API method that deletes an item
  ////////////////////////////////////////////////////////////////////////////
  static async deleteItems(target, itemIds) {
    // Debug
    C.D.info('Bridge.deleteItems()');

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

  ////////////////////////////////////////////////////////////////////////////
  // Method that extracts useful information from items
  ////////////////////////////////////////////////////////////////////////////
  static getItemInformation(item) {
    // Debug
    C.D.info('Bridge.getItemInformation()');

    // Basic info
    const name = item.name;
    const owner = item.parent;
    const img = item.img;

    return {
      name,
      owner,
      img,
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Method that sets the information of an item
  ////////////////////////////////////////////////////////////////////////////
  static setItemInformation(item, information) {
    if (this.constructor == Bridge) {
      throw new Error('Abstract method not implemented');
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Method that is called when a hook is triggered
  ////////////////////////////////////////////////////////////////////////////
  static getHookInformation(workflow, source, from) {
    if (this.constructor == Bridge) {
      throw new Error('Abstract method not implemented');
    }
  }
}
