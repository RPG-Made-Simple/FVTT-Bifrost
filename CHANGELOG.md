# 🌈 Bifrost Changelog

## Version 1.0.0
> This library was part of [OIF](https://foundryvtt.com/packages/object-interaction-fx), all of the changes here are relative to that module.
- *Internal* - Converted the complex system selector to an abstract class that requires its children to implement the abstract methods.
- *Internal* - Item creation is now requested from another user that is capable in case the current one is not.
- *Internal* - Hook information extraction does not extract `Tags` anymore.
- *API* - Exposed only the current `Bridge` as the `API`, which is set based on the current system being used.
- *Bridge* - Added [DnD5e](https://foundryvtt.com/packages/dnd5e).
- *Bridge* - Added [Pf2e](https://foundryvtt.com/packages/pf2e).

##
