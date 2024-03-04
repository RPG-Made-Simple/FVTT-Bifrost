/**
 * Bifrost provides developers with a generic enough interface to make
 * system-agnostic implementations easier.
 * @module
 */
import { Constants as C, ModuleHooks } from "./constants"

// Bridges
import { DnD5eBridge } from "./bridge"
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
    // Informs that the module is initializing, this is when things that want
    // to modify the module, or provide some sort of support, should hook on
    // @ts-ignore
    Hooks.call(ModuleHooks.INITIALIZING);

    // Gets executed when Toolbox is ready
    // @ts-ignore
    Hooks.once('toolbox.ready', () => {
      // @ts-ignore
      Toolbox.showcaseModule(C.NAME_FLAT);

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

      // Setup API and methods
      window['Bifrost'] = C.CURRENT_BRIDGE;

      // Informs that the module is ready to be used
      // @ts-ignore
      Hooks.call(ModuleHooks.READY);

      // Debug
      C.D.info('Ready!!');
    });
  }
}
