/**
 * Bifrost provides developers with a generic enough interface to make
 * system-agnostic implementations easier.
 * @module
 */
import { Constants as C } from "./constants"

// Bridges
import { DnD5eBridge } from "./bridges/dnd5e"
//import { Pf2eBridge } from "./bridges/pf2e";

/**
 * Main module class.
 */
export class Bifrost {
  /**
   * Initializes the module, everything that is essential to the module is
   * first initialized here.
   */
  static initialize() {
    // Setup current bridge
    // @ts-ignore
    switch (game.system.id) {
      case 'dnd5e': {
        C.CURRENT_BRIDGE = new DnD5eBridge();
        break;
      }
      //case 'pf2e': {
      //  C.CURRENT_BRIDGE = Pf2eBridge;
      //  break;
      //}
      default: {
        // @ts-ignore
        ui.notifications.error(game.i18n.format("bifrost.error.system-not-supported", { system: Gamepad.system.name }));
        // @ts-ignore
        throw new Error(`"${game.system.id}" is not yet supported by Bifrost`);
      }
    }

    // @ts-ignore
    Hooks.call('bifrost.init');
  }
}
