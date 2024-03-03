import { Constants as C } from "../constants";
import { Bridge } from "../bridge";
import { ItemInformation } from "../item_information";
import { HookInformation, HookType } from "../hook_information";
import { HyperInformation } from "../hyper_information";
import { SystemInformation, SystemRange, SystemRangeUnit } from "../system_information";

/**
 * Bridge for Pathfinder 2e
 */
export class Pf2eBridge extends Bridge {
  registerReplicated(socket: any) {
    socket.register('createItems', this._createItems);
    socket.register('deleteItems', this._deleteItems);
  }

  get attackHooks() {
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

  get itemHooks() {
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

  get hyperInformation() {
    return new HyperInformation({
      lighting: {
        automate: true,
        changeImg: false,
      }
    });
  }

  get systemInformation() {
    return new SystemInformation({
      range: {
        melee: new SystemRange(SystemRangeUnit.Foot, 5),
      }
    });
  }

  async _createItems(targetUuid, items) {
    // Debug
    C.D.info('Pf2eBridge._createItems()');

    await this._createItems(targetUuid, items);
  }

  async createItems(target, items) {
    // Debug
    C.D.info('Pf2eBridge.createItems()');

    return await this.createItems(target, items);
  }

  async _deleteItems(targetUuid, itemIds) {
    // Debug
    C.D.info('Pf2eBridge._deleteItems()');

    await this._deleteItems(targetUuid, itemIds);
  }

  async deleteItems(target, itemIds) {
    // Debug
    C.D.info('Pf2eBridge.deleteItems()');

    return await this.deleteItems(target, itemIds);
  }

  getItemInformation(item) {
    // Debug
    C.D.info('Pf2eBridge.getItemInformation()');

    // Basic info
    const basic = this.getBasicItemInformation(item);

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
        // @ts-ignore
        thrownDistance = parseInt(trait.split('-')[1] * 7);
      }
    }

    return new ItemInformation({
      basic,
      physical: {
        quantity,
      },
      properties: {
        magical: false,
        thrown,
        returns: false,
        finesse: false,
      },
    });
  }

  async setItemInformation(item: any, information: ItemInformation) {
    // Debug
    C.D.info('Pf2eBridge.setItemInformation()');

    const itemInformation = this.getItemInformation(item);

    // TODO
  }

  getHookInformation(workflow, source: HookType, from) {
    // Debug
    C.D.info('Pf2eBridge.extractHookInformation()');

    // Debug
    C.D.info('Using default hook', source, from, workflow);

    // Retrieve the item
    const item = workflow[0].item;

    // Retrieve the token
    // @ts-ignore
    const token = canvas.tokens.get(workflow[0].token._id);

    // Retrieve the targets
    // @ts-ignore
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
      case HookType.Attack: {
        // Did it miss?
        const outcome = workflow[0].flags.pf2e.context?.outcome ?? '';
        switch (outcome) {
          case 'criticalFailure': {
            didMiss = true;
            didFumble = true;
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
      case HookType.Item: {
        // Did it miss?
        didMiss = false;
        break;
      }
    }

    return new HookInformation({
      item,
      actor: token.actor,
      token,
      targets,
      hitTargets,
      type: source,
      dice: {
        roll: -1,
        total: rollTotal,
        critical: didCrit,
        fumble: didFumble,
      },
    });
  }
}
