// Bifrost provides developers with a generic enough interface between modules
// to make system-agnostic implementations easier.
import { Constants as C } from "./constants";
import { Bifrost } from "./bifrost";

Bifrost.initialize();

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

// Setup the socket when socketlib is ready
// @ts-ignore
Hooks.once('socketlib.ready', () => {
  // @ts-ignore
  C.SOCKET = socketlib.registerModule(C.ID);

  // @ts-ignore
  Hooks.once('bifrost.init', () => {
    C.CURRENT_BRIDGE.registerReplicated(C.SOCKET);
  });
});
