// ? Bifrost provides developers with a generic enough interface between modules
// ? to make system-agnostic implementations easier.
import { Constants as C } from "./constants";
import { Bifrost } from "./bifrost";

////////////////////////////////////////////////////////////////////////////////
// Entry-point for everything
////////////////////////////////////////////////////////////////////////////////
// @ts-ignore
Hooks.once('init', () => {
  // @ts-ignore
  Hooks.once('toolbox.ready', () => {
    // @ts-ignore
    Toolbox.showcaseModule(C.NAME_FLAT);

    Bifrost.initialize();

    // Setup the socket methods
    // @ts-ignore
    Hooks.once('bifrost.register-socket-methods', () => {
      C.SOCKET.register('createItems', C.CURRENT_BRIDGE._createItems);
    });

    // Setup API and methods
    window['Bifrost'] = C.CURRENT_BRIDGE;

    // Informs that bifrost is ready to be used
    // @ts-ignore
    Hooks.call('bifrost.ready');

    // Debug
    C.D.info('Ready!!');
  });

  // Debug info
  // @ts-ignore
  Hooks.once('debugger.ready', () => {
    // @ts-ignore
    C.D = new Debugger(C.ID, C.NAME, true, true);
    C.D.info('Module Information:');
    // @ts-ignore
    C.D.info(`Version ${game.modules.get(C.ID).version}`);
    C.D.info('Library By ZotyDev');
  });
});

// Setup the socket
// @ts-ignore
Hooks.once('socketlib.ready', () => {
  // @ts-ignore
  C.SOCKET = socketlib.registerModule(C.ID);

  // @ts-ignore
  Hooks.once('bifrost.init', () => {
    C.CURRENT_BRIDGE.registerReplicated(C.SOCKET);
  });
});
