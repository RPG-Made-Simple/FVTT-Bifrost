import { Constants as C } from "../constants";
import { BridgeAbstract } from "./bridge_abstract";
import { HyperInformation } from "../hyper_information";
import { SystemInformation, SystemRange, SystemRangeUnit } from "../system_information";
import { ItemInformation } from "../item_information";
import { HookInformation, HookType } from "../hook_information";

function propertyToggle(properties, property, string) {
  if (property != undefined) {
    if (property) {
      properties.add(string);
    } else {
      properties.delete(string);
    }
    return true;
  } else {
    return false;
  }
}

/**
 * Bridge for DnD5e.
 */
export class DnD5eBridge extends BridgeAbstract {
  registerReplicated(socket: any) {
    socket.register('createItems', this._createItems);
    socket.register('deleteItems', this._deleteItems);
  }

  get attackHooks() {
    // System hooks
    const system = [
      {
        name: 'bifrost.dnd5e.hooks.after-attack-roll.label',
        value: 'dnd5e.rollAttack',
      },
      {
        name: 'bifrost.dnd5e.hooks.after-damage-roll.label',
        value: 'dnd5e.rollDamage',
      }
    ];

    // MidiQol hooks
    // @ts-ignore
    const isMidiDisabled = !game.modules.get('midi-qol')?.active;
    const midiQol = [
      {
        name: 'bifrost.midi-qol.hooks.after-attack-roll.label',
        value: 'midi-qol.AttackRollComplete',
        disabled: isMidiDisabled,
      },
      {
        name: 'bifrost.midi-qol.hooks.after-damage-roll.label',
        value: 'midi-qol.DamageRollComplete',
        disabled: isMidiDisabled,
      },
      {
        name: 'bifrost.midi-qol.hooks.after-roll-complete.label',
        value: 'midi-qol.RollComplete',
        disabled: isMidiDisabled,
      }
    ];

    return [
      ...system,
      ...midiQol,
    ];
  }

  get itemHooks() {
    // System hooks
    const system = [
      {
        name: 'bifrost.dnd5e.hooks.after-item-roll.label',
        value: 'dnd5e.useItem',
      }
    ];

    return [
      ...system,
    ];
  }

  get hyperInformation() {
    return new HyperInformation({
    });
  }

  get systemInformation() {
    return new SystemInformation({
      range: {
        melee: new SystemRange(SystemRangeUnit.Foot, 5),
      }
    });
  }

  async _createItems(targetUuid: string, items: Array<any>) {
    // Debug
    C.D.info('DnD5eBridge._createItems()');

    await this._createItems(targetUuid, items);
  }

  async createItems(target: any, items: Array<any>) {
    // Debug
    C.D.info('DnD5eBridge.createItems()');

    return await this.createItems(target, items);
  }

  async _deleteItems(targetUuid: string, itemIds: Array<string>) {
    // Debug
    C.D.info('DnD5eBridge._deleteItems()');

    await this._deleteItems(targetUuid, itemIds);
  }

  async deleteItems(target: any, itemIds: Array<string>) {
    // Debug
    C.D.info('DnD5eBridge.deleteItems()');

    return await this.deleteItems(target, itemIds);
  }

  getItemInformation(item: any) {
    // Debug
    C.D.info('DnD5eBridge.getItemInformation()');

    // Debug
    C.D.info('Getting item information from:', item);

    // Basic info
    const basic = this.getBasicItemInformation(item);

    return new ItemInformation({
      basic,
      physical: {
        quantity: item.system.quantity,
      },
      properties: {
        magical: item.system.properties.has('mgc'),
        thrown: item.system.properties.has('thr'),
        returns: item.system.properties.has('ret'),
        finesse: item.system.properties.has('fin'),
      },
      material: {
        adamantine: item.system.properties.has('ada'),
        silver: item.system.properties.has('sil'),
      },
      range: {
        melee: new SystemRange(
          SystemRangeUnit.Foot,
          // @ts-ignore
          item.system.properties.has('rch') ? canvas.dimensions.distance * 2 : canvas.dimensions.distance,
        ),
        min: new SystemRange(SystemRangeUnit.Foot, item.system.range?.value ?? -1),
        max: new SystemRange(SystemRangeUnit.Foot, item.system.range?.long ?? -1),
      },
      ammo: {
        has: item.system.properties.has('amm'),
        item: item.system.consume?.amount,
        quantity: item.system.consume?.amount ?? -1,
      },
      state: {
        equipped: item.system.equipped
      }
    });
  }

  async setItemInformation(item: any, information: ItemInformation) {
    // Debug
    C.D.info('DnD5eBridge.setItemInformation()');

    const itemInformation = this.getItemInformation(item);

    // @ts-ignore
    const hasOwner = Toolbox.check(itemInformation.basic.owner);

    // Debug
    C.D.info('Setting information for:', item);
    C.D.info('Passed information was:', information);
    C.D.info(`Has owner? ${hasOwner} -`, itemInformation.basic.owner);

    // The data that will be updated should be put here
    let data = {};
    let properties = structuredClone(item.system.properties);
    let propertiesChanged = false;

    // Set physical
    // @ts-ignore
    if (Toolbox.check(information.physical)) {
      // Debug
      C.D.info('Applying "physical" information...', information.physical);

      data['system.quantity'] = information.physical.quantity;
    }

    // Set properties
    // @ts-ignore
    if (Toolbox.check(information.properties)) {
      // Debug
      C.D.info('Applying "properties" information...', information.properties);

      propertiesChanged = propertiesChanged || propertyToggle(properties, information.properties.magical, 'mgc');
      propertiesChanged = propertiesChanged || propertyToggle(properties, information.properties.thrown, 'thr');
      propertiesChanged = propertiesChanged || propertyToggle(properties, information.properties.returns, 'ret');
      propertiesChanged = propertiesChanged || propertyToggle(properties, information.properties.finesse, 'fin');
    }

    // Set material
    // @ts-ignore
    if (Toolbox.check(information.material)) {
      // Debug
      C.D.info('Applying "material" information...', information.material);

      propertiesChanged = propertiesChanged || propertyToggle(properties, information.material.adamantine, 'ada');
      propertiesChanged = propertiesChanged || propertyToggle(properties, information.material.silver, 'sil');
    }

    // Set range
    // @ts-ignore
    if (Toolbox.check(information.range)) {
      // Debug
      C.D.info('Applying "range" information...', information.range);

      data['system.range.value'] = information.range.min;
      data['system.range.long'] = information.range.max;
      data['system.range.']
    }

    // Set state
    // @ts-ignore
    if (Toolbox.check(information.state)) {
      // Debug
      C.D.info('Applying "state" information...', information.state);

      data['system.equipped'] = information.state.equipped;
    }

    // Apply the new information
    // @ts-ignore
    if (Toolbox.check(data) || propertiesChanged) {
      await item.update(
        {
          'system.properties': [...properties],
          ...data,
        });
    }
  }

  getHookInformation(workflow: Array<any>, source: HookType, from: string) {
    // Debug
    C.D.info('DnD5eBridge.getHookInformation()');

    // Check if MidQol is active and if the hook comes from the module
    // @ts-ignore
    let shouldUseMidiQol = game.modules.get('midi-qol')?.active;
    shouldUseMidiQol = shouldUseMidiQol && source === HookType.Attack;
    const usedHook = from;
    const didUseMidiHook =
      usedHook == 'midi-qol.AttackRollComplete' ||
      usedHook == 'midi-qol.DamageRollComplete' ||
      usedHook == 'midi-qol.RollComplete';
    shouldUseMidiQol = shouldUseMidiQol && didUseMidiHook;

    if (shouldUseMidiQol) {
      // Debug
      C.D.info('Using MidiQol hook', source, from, workflow);

      // Retrieve the item
      const item = workflow[0].item;

      // Retrieve the token
      // @ts-ignore
      const token = canvas.tokens.get(workflow[0].tokenId);

      // Retrieve the targets
      // @ts-ignore
      const targets = Array.from(game.user.targets);
      const hitTargets = workflow[0].hitTargets;

      // Special treatment
      let didMiss;
      switch (source) {
        case HookType.Attack: {
          // Did it miss?
          didMiss = hitTargets.size === 0 ?? false;

          break;
        }
        case HookType.Item: {
          // Did it miss?
          didMiss = false;

          break;
        }
      }

      let hookInformation = new HookInformation({
        item,
        actor: token.actor,
        token,
        targets,
        hitTargets,
        type: source,
        dice: {
          roll: workflow[0].roll,
          total: workflow[0].attackTotal,
          critical: workflow[0].isCritical,
          fumble: workflow[0].isFumble,
        }
      });

      return hookInformation;
    // If Midi QOL is not active
    } else {
      // Debug
      C.D.info('Using default hook', source, from, workflow);

      // Retrieve the item
      const item = workflow[0];

      // Retrieve the actor and token
      const actor = item.parent;
      const token = actor.token?.object ?? actor.getActiveTokens()[0];

      // Retrieve the targets
      // @ts-ignore
      const targets = Array.from(game.user.targets);
      const hitTargets = targets.filter((target) => {
        // @ts-ignore
        return target.actor.system.attributes.ac.value <= workflow[1].total;
      });

      // Special treatment
      let rollTotal = -1;
      let didMiss = false;
      switch (source) {
        case HookType.Attack: {
          // Did it miss?
          didMiss = workflow[1].isCritical ? false : hitTargets.length === 0 ?? false;

          // Retrieve the roll total
          let usedDice = workflow[1].dice[0].results;
          usedDice = usedDice.filter((dice) => {
            return dice.active;
          });
          rollTotal = usedDice.reduce((a, b) => a + b.result, 0);

          break;
        }
        case HookType.Item: {
          // Did it miss?
          didMiss = false;

          break;
        }
      }

      let hookInformation = new HookInformation({
        item,
        actor,
        token,
        targets,
        hitTargets,
        type: source,
        dice: {
          roll: rollTotal,
          total: workflow[1]?._total ?? -1,
          critical: workflow[1]?.isCritical,
          fumble: workflow[1]?.isFumble,
        },
      });

      return hookInformation;
    }
  }
}
