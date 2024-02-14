////////////////////////////////////////////////////////////////////////////////
//                     ____  _  __               _                            //
//                    |  _ \(_)/ _|             | |                           //
//                    | |_) |_| |_ _ __ ___  ___| |_                          //
//                    |  _ <| |  _| '__/ _ \/ __| __|                         //
//                    | |_) | | | | | | (_) \__ \ |_                          //
//                    |____/|_|_| |_|  \___/|___/\__| LIBRARY                 //
//                                                      By ZotyDev            //
////////////////////////////////////////////////////////////////////////////////
// ? Bridge for DnD5e. You can use this as example if you want to port a system
// ? to bifrost. Please submit a PR when you are done, so we can provide support
// ? to the maximum amount of systems.
import { Constants as C } from "../constants.js";
import { Bridge } from "../bridge.js";

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

export class DnD5eBridge extends Bridge {
  constructor() {}

  //////////////////////////////////////////////////////////////////////////////
  // Register the replicated methods
  //////////////////////////////////////////////////////////////////////////////
  static registerReplicated(socket) {
    socket.register('createItems', DnD5eBridge._createItems);
    socket.register('deleteItems', DnD5eBridge._deleteItems);
  }

  //////////////////////////////////////////////////////////////////////////////
  // Returns all the useful hooks for attack
  //////////////////////////////////////////////////////////////////////////////
  static get attackHooks() {
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

  //////////////////////////////////////////////////////////////////////////////
  // Returns all the useful hooks for items
  //////////////////////////////////////////////////////////////////////////////
  static get itemHooks() {
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

  //////////////////////////////////////////////////////////////////////////////
  // Returns all the hyper information about the bridge
  //////////////////////////////////////////////////////////////////////////////
  static get hyperInformation() {
    return {
      lighting: {
        apply: true,
        changeImg: true,
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Returns useful system information
  //////////////////////////////////////////////////////////////////////////////
  static get systemInformation() {
    return {
      rangeMelee: canvas.dimensions.distance,
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Method that creates an item
  //////////////////////////////////////////////////////////////////////////////
  static async _createItems(targetUuid, items) {
    // Debug
    C.D.info('DnD5eBridge._createItems()');

    await super._createItems(targetUuid, items);
  }

  //////////////////////////////////////////////////////////////////////////////
  // API method that creates an item
  //////////////////////////////////////////////////////////////////////////////
  static async createItems(target, items) {
    // Debug
    C.D.info('DnD5eBridge.createItems()');

    await super.createItems(target, items);
  }

  //////////////////////////////////////////////////////////////////////////////
  // Method that deletes an item
  //////////////////////////////////////////////////////////////////////////////
  static async _deleteItems(targetUuid, itemIds) {
    // Debug
    C.D.info('DnD5eBridge._deleteItems()');

    await super._deleteItems(targetUuid, itemIds);
  }

  //////////////////////////////////////////////////////////////////////////////
  // API method that deletes an item
  //////////////////////////////////////////////////////////////////////////////
  static async deleteItems(target, itemIds) {
    // Debug
    C.D.info('DnD5eBridge.deleteItems()');

    await super.deleteItems(target, itemIds);
  }

  //////////////////////////////////////////////////////////////////////////////
  // Method that extracts useful information from items
  //////////////////////////////////////////////////////////////////////////////
  static getItemInformation(item) {
    // Debug
    C.D.info('DnD5eBridge.getItemInformation()');

    // Debug
    C.D.info('Getting item information from:', item);

    // Basic info
    const basic = super.getItemInformation(item);

    return {
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
        melee: item.system.properties.has('rch') ? canvas.dimensions.distance * 2 : canvas.dimensions.distance,
        min: item.system.range?.value,
        max: item.system.range?.long,
        units: item.system.ragen?.units,
      },
      ammo: {
        has: item.system.properties.has('amm'),
        item: item.system.comsume?.amount,
        quantty: item.system.comsume?.amount,
      },
      state: {
        equipped: item.system.equipped,
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Method that sets the information of an item
  // TODO this needs to be completely changed, there are multiple updates that
  // TODO need to be only one.
  //////////////////////////////////////////////////////////////////////////////
  static async setItemInformation(item, information) {
    // Debug
    C.D.info('DnD5eBridge.setItemInformation()');

    const itemInformation = DnD5eBridge.getItemInformation(item);

    let owner = itemInformation.basic.owner;
    const hasOwner = Toolbox.check(owner);

    // Debug
    C.D.info('Setting information for:', item);
    C.D.info('Passed information was:', information);
    C.D.info(`Has owner? ${hasOwner} -`, owner);

    // The data that will be updated should be put here
    let data = {};
    let properties = structuredClone(item.system.properties);
    let propertiesChanged = false;

    // Set physical
    if (Toolbox.check(information.physical)) {
      // Debug
      C.D.info('Applying "physical" information...', information.physical);

      data['system.quantity'] = information.physical.quantity;
    }

    // Set properties
    if (Toolbox.check(information.properties)) {
      // Debug
      C.D.info('Applying "properties" information...', information.properties);

      propertiesChanged |= propertyToggle(properties, information.properties.magical, 'mgc');
      propertiesChanged |= propertyToggle(properties, information.properties.thrown, 'thr');
      propertiesChanged |= propertyToggle(properties, information.properties.returns, 'ret');
      propertiesChanged |= propertyToggle(properties, information.properties.finesse, 'fin');
    }

    // Set material
    if (Toolbox.check(information.material)) {
      // Debug
      C.D.info('Applying "material" information...', information.material);

      propertiesChanged |= propertyToggle(properties, information.material.adamantine, 'ada');
      propertiesChanged |= propertyToggle(properties, information.material.silver, 'sil');
    }

    // Set range
    if (Toolbox.check(information.range)) {
      // Debug
      C.D.info('Applying "range" information...', information.range);

      data['system.range.value'] = information.range.min;
      data['system.range.long'] = information.range.max;
      data['system.range.']
    }

    // Set state
    if (Toolbox.check(information.state)) {
      // Debug
      C.D.info('Applying "state" information...', information.state);

      data['system.equipped'] = information.state.equipped;
    }

    // Apply the new information
    if (Toolbox.check(data) || propertiesChanged) {
      await item.update(
        {
          'system.properties': [...properties],
          ...data,
        });
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Method that is called when a hook is triggered, note that this method is
  // called for every hook, so it is important to make sure the data we are
  // extracting is the one we want
  //
  // (for example, if we are using MidiQOL, we only want to extract data from
  // the MidiQOL hooks)
  //////////////////////////////////////////////////////////////////////////////
  static getHookInformation(workflow, source, from) {
    // Debug
    C.D.info('DnD5eBridge.getHookInformation()');

    // Check if MidQol is active and if the hook comes from the module
    let shouldUseMidiQol = game.modules.get('midi-qol')?.active;
    shouldUseMidiQol = shouldUseMidiQol && source == 'attack';
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
      const token = canvas.tokens.get(workflow[0].tokenId);

      // Retrieve the targets
      const targets = Array.from(game.user.targets);
      const hitTargets = workflow[0].hitTargets;

      // Special treatment
      let didMiss;
      switch (source) {
        case 'attack': {
          // Did it miss?
          didMiss = hitTargets.size === 0 ?? false;

          break;
        }
        case 'item': {
          // Did it miss?
          didMiss = false;

          break;
        }
      }

      // Set the options
      let options = {
        item: item,
        actor: token.actor,
        token: token,
        targets: targets,
        hitTargets: hitTargets,
        miss: hitTargets.size === 0 ?? false,
        type: source,
        dice: {
          roll: workflow[0].roll,
          total: workflow[0].attackTotal,
          critical: workflow[0].isCritical,
          fumble: workflow[0].isFumble,
        },
      }

      // Recalculate melee weapon distance if the item has the reach
      // propertie
      if (item.system.properties?.rch) {
        options.system.meleeWeaponDistance *= 2;
      }

      return options;
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
      const targets = Array.from(game.user.targets);
      const hitTargets = targets.filter((target) => {
        return target.actor.system.attributes.ac.value <= workflow[1].total;
      });

      // Special treatment
      let rollTotal = undefined;
      let didMiss = false;
      switch (source) {
        case 'attack': {
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
        case 'item': {
          // Did it miss?
          didMiss = false;

          break;
        }
      }

      // Set the options
      let options = {
        item: item,
        actor: actor,
        token: token,
        targets: targets,
        hitTargets: hitTargets,
        miss: didMiss,
        type: source,
        dice : {
          roll: rollTotal,
          total: workflow[1]?._total,
          critical: workflow[1]?.isCritical,
          fumble: workflow[1]?.isFumble,
        },
        system: {
          meleeWeaponDistance: canvas.dimensions.distance,
          normalDistance: item.system.range.value,
          longDistance: item.system.range.long,
          isThrowable: item.system.properties?.thr,
          isConsumeAmmo: item.system.properties?.amm,
          ammoItem: item.system.consume?.target,
        },
      }

      // Recalculate melee weapon distance if the item has the reach tag
      if (item.system.properties?.rch) {
        options.system.meleeWeaponDistance *= 2;
      }

      return options;
    }
  }
}
