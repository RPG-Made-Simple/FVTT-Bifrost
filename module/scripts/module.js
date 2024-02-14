////////////////////////////////////////////////////////////////////////////////
//                     ____  _  __               _                            //
//                    |  _ \(_)/ _|             | |                           //
//                    | |_) |_| |_ _ __ ___  ___| |_                          //
//                    |  _ <| |  _| '__/ _ \/ __| __|                         //
//                    | |_) | | | | | | (_) \__ \ |_                          //
//                    |____/|_|_| |_|  \___/|___/\__| LIBRARY                 //
//                                                      By ZotyDev            //
////////////////////////////////////////////////////////////////////////////////
// ? Bifrost provides developers with a generic enough interface between modules
// ? to make system-agnostic implementations easier.
import { Constants as C } from "./constants.js";
import { Bifrost } from "./bifrost.js";

////////////////////////////////////////////////////////////////////////////////
// Entry-point for everything
////////////////////////////////////////////////////////////////////////////////
Hooks.once('init', () => {
  Hooks.once('toolbox.ready', () => {
    Toolbox.showcaseModule(C.NAME_FLAT);

    Bifrost.initialize();

    // Setup the socket methods
    Hooks.once('bifrost.register-socket-methods', () => {
      C.SOCKET.register('createItems', C.CURRENT_BRIDGE._createItems);
    });

    // Setup API and methods
    window['Bifrost'] = C.CURRENT_BRIDGE;

    // Informs that bifrost is ready to be used
    Hooks.call('bifrost.ready');

    // Debug
    C.D.info('Ready!!');
  });

  // Debug info
  Hooks.once('debugger.ready', () => {
    C.D = new Debugger(C.ID, C.NAME, true, true);
    C.D.info('Module Information:');
    C.D.info(`Version ${game.modules.get(C.ID).version}`);
    C.D.info('Library By ZotyDev');
  });
});

// Setup the socket
Hooks.once('socketlib.ready', () => {
  C.SOCKET = socketlib.registerModule(C.ID);

  Hooks.once('bifrost.init', () => {
    C.CURRENT_BRIDGE.registerReplicated(C.SOCKET);
  });
});
