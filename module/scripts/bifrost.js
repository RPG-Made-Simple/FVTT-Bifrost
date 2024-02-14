////////////////////////////////////////////////////////////////////////////////
//                     ____  _  __               _                            //
//                    |  _ \(_)/ _|             | |                           //
//                    | |_) |_| |_ _ __ ___  ___| |_                          //
//                    |  _ <| |  _| '__/ _ \/ __| __|                         //
//                    | |_) | | | | | | (_) \__ \ |_                          //
//                    |____/|_|_| |_|  \___/|___/\__| LIBRARY                 //
//                                                      By ZotyDev            //
////////////////////////////////////////////////////////////////////////////////
// ? Main module class.
import { Constants as C } from "./constants.js"

// Bridges
import { DnD5eBridge } from "./bridges/dnd5e.js"
import { Pf2eBridge } from "./bridges/pf2e.js";

export class Bifrost {
  ////////////////////////////////////////////////////////////////////////////
  // Initializes the module
  ////////////////////////////////////////////////////////////////////////////
  static initialize() {
    // Setup current bridge
    switch (game.system.id) {
      case 'dnd5e': {
        C.CURRENT_BRIDGE = DnD5eBridge;
        break;
      }
      case 'pf2e': {
        C.CURRENT_BRIDGE = Pf2eBridge;
        break;
      }
      default: {
        throw new Error(`"${game.system.id}" is not yet supported by Bifrost`);
      }
    }

    Hooks.call('bifrost.init');
  }
}
