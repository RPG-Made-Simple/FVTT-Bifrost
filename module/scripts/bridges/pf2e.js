////////////////////////////////////////////////////////////////////////////////
//                     ____  _  __               _                            //
//                    |  _ \(_)/ _|             | |                           //
//                    | |_) |_| |_ _ __ ___  ___| |_                          //
//                    |  _ <| |  _| '__/ _ \/ __| __|                         //
//                    | |_) | | | | | | (_) \__ \ |_                          //
//                    |____/|_|_| |_|  \___/|___/\__| LIBRARY                 //
//                                                      By ZotyDev            //
////////////////////////////////////////////////////////////////////////////////
// ? Bridge for Pathfinder 2e.
import { Constants as C } from "../constants.js";
import { Bridge } from "../bridge.js";

export class Pf2eBridge extends Bridge {
  constructor() {}

  ////////////////////////////////////////////////////////////////////////////
  // Returns all the useful hooks for attack
  ////////////////////////////////////////////////////////////////////////////
  static get attackHooks() {
    // System hooks
    const system = [
      {
        name: 'bifrost.pf2e.hooks.after-attack-roll.label',
        value: 'createChatMessage',
      },
    ];

    return [
      ...system,
    ];
  }

  ////////////////////////////////////////////////////////////////////////////
  // Returns all the useful hooks for items
  ////////////////////////////////////////////////////////////////////////////
  static get itemHooks() {
    // System hooks
    const system = [
      {
        name: 'bifrost.pf2e.hooks.after-item-roll.label',
        value: 'createChatMessage',
      }
    ];

    return [
      ...system,
    ];
  }

  ////////////////////////////////////////////////////////////////////////////
  // Method that creates an item
  ////////////////////////////////////////////////////////////////////////////
  static async _createItems(targetUuid, items) {
    // Debug
    C.D.info('Pf2eBridge._createItems()');

    await super._createItems(targetUuid, items);
  }

  ////////////////////////////////////////////////////////////////////////////
  // API method that creates an item
  ////////////////////////////////////////////////////////////////////////////
  static async createItems(target, items) {
    // Debug
    C.D.info('Pf2eBridge.createItems()');

    await super.createItems(target, items);
  }

  ////////////////////////////////////////////////////////////////////////////
  // Method that deletes an item
  ////////////////////////////////////////////////////////////////////////////
  static async _deleteItems(targetUuid, itemIds) {
    // Debug
    C.D.info('Pf2eBridge._deleteItems()');

    await super._deleteItems(targetUuid, itemIds);
  }

  ////////////////////////////////////////////////////////////////////////////
  // API method that deletes an item
  ////////////////////////////////////////////////////////////////////////////
  static async deleteItems(target, itemIds) {
    // Debug
    C.D.info('Pf2eBridge.deleteItems()');

    await super.deleteItems(target, itemIds);
  }

  ////////////////////////////////////////////////////////////////////////////
  // Method that extracts useful information from items
  ////////////////////////////////////////////////////////////////////////////
  static getItemInformation(item) {
    // Debug
    C.D.info('Pf2eBridge.getItemInformation()');

    // Basic info
    const basic = super.getItemInformation();

    // Physical
    const quantity = item.system.quantity;

    // Range

    // Properties
    let thrown = false;
    let thrownDistance = undefined;
    for (const trait of item.system.traits.value) {
      if (trait == 'thrown') {
        thrown = true;
        thrownDistance = item.system.range ? item.system.range * 7 : 7;
      }
      else if (trait.includes('thrown')) {
        thrown = true;
        thrownDistance = parseInt(trait.split('-')[1] * 7);
      }
    }

    let options = {
      basic,
      physical: {
        quantity: quantity,
      },
      properties: {
        thrown
      }
    }

    return options;
  }

  ////////////////////////////////////////////////////////////////////////////
  // Method that is called when a hook is triggered
  ////////////////////////////////////////////////////////////////////////////
  static getHookInformation(workflow, source, from) {
    // Debug
    C.D.info('Pf2eBridge.extractHookInformation()');

    // Debug
    C.D.info('Using default hook', source, from, workflow);

    // Retrieve the item
    const item = workflow[0].item;

    // Retrieve the token
    const token = canvas.tokens.get(workflow[0].token._id);

    // Retrieve the targets
    const targets = Array.from(game.user.targets);
    const hitTargets = targets.filter((target) => {
      true;
    });

    // Special tratment
    let rollTotal = undefined;
    let didMiss = false;
    let didCrit = false;
    let didFumble = false;
    switch (source) {
      case 'attack': {
        // Did it miss?
        const outcome = workflow[0].flags.pf2e.context?.outcome ?? '';
        switch (outcome) {
          case 'criticalFailure': {
            didMiss = true;
            didFumble - true;
            break;
          }
          case 'failure': {
            didMiss = true;
            break;
          }
          case 'success': {
            didMiss = false;
            break;
          }
          case 'criticalSuccess': {
            didMiss = false;
            didCrit = true;
            break;
          }
        }

        // Get the roll total
        rollTotal = workflow[0].rolls._total;

        break;
      }
      case 'item': {
        // Did it miss?
        didMiss = false;
        break;
      }
    }

    let isThrowable = false;
    let throwableDistance = undefined;
    for (const trait of item.system.traits.values) {
      if (trait == 'thrown') {
        isThrowable = true;
        throwableDistance = item.system.range * 7;
      } else if (trait.includes('thrown')) {
        isThrowable = true;
        throwableDistance = parseInt(trait.split('-')[1] * 7);
      }
    }

    let options = {
      item: item,
      actor: token.actor,
      token: token,
      targets: targets,
      hitTargets: hitTargets,
      miss: didMiss,
      type: source,
      dice: {
        roll: undefined,
        total: rollTotal,
        critical: didCrit,
        fumble: didFumble,
      },
      system: {
        meleeWeaponDistance: canvas.dimensions.distance,
        normalDistance: isThrowable ? canvas.dimensions.distance : item.system.range,
        longDistance: isThrowable ? throwableDistance : item.system.range,
        isThrowable: isThrowable,
        isConsumeAmmo: false, // TODO
        ammoItem: '', // TODO
      }
    }

    return options;
  }
}
