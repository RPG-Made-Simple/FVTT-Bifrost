<a href="https://foundryvtt.com/packages/bifrost">
  <p align="center">
    <img src="https://raw.githubusercontent.com/RPG-Made-Simple/FVTT-Bifrost/main/branding/title.png" alt="Bifrost Title">
  </p>
</a>

<p align="center">
  <a href="https://discord.gg/RAgPXB4zG7">
    <img src="https://discord.com/api/guilds/1071251491375042661/widget.png?style=shield"/>
  </a>
</p>

A FoundryVTT library that provides a **system-agnostic ~~[`API`]()~~ (WIP)**  to interact with Foundry without worrying about system implementation details.

**Do not** expect a smooth experience, this is a complex subject and the module is currently not concrete enough for being widely adopted.

> [!NOTE]
> This **system-agnostic** approach requires the system to be supported by Bifrost, and that requires a custom ~~[`Bridge`]()~~ (WIP) implementation.

> [!NOTE]
> For simplicity's sake this module **contains all the supported systems**, even if you plan to never use the other systems. This is to prevent any extra efforts from the players while using the module, we wnat a streamlined approach that makes user errors minimal.

> [!CAUTION]
> Please, do not use Bifrost on games where you do not completely trust your players. The module exposes some API functionalities that are not completely safe, **items can be created and deleted** anywhere when using Bifrost, so be careful while using the module.
>
> This will be fixed in a near future, but for now if you are in doubt, don't use Bifrost yet!

> [!TIP]
> If you are developing a system, please consider [supporting]() Bifrost by supplying your own ~~[`Bridge`]()~~ (WIP) implementation, that way you can make your system compatible with all the modules that use Bifrost as the interface to interact with system-specific info.

---

Do you like the module? Consider supporting it :)

<a href='https://ko-fi.com/T6T8IFCB5' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi5.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

---

### Note for **Developers** (**modules** and **macros**)
Take a look at the ~~[Documentation]()~~ WIP

---
## Supported Systems
- [DnD5e](https://foundryvtt.com/packages/dnd5e)

---
## Supported Versions
- **V11**
- ~~**V12**~~ _as soon as it gets released_

## TODO
- [ ] Unit tests for internal functionalities.
- [ ] Automated tests on a complete workspace.

<h2 align="center"><a href="https://github.com/RPG-Made-Simple/FVTT-Bifrost/blob/main/CHANGELOG.md">Changelog</a></h2>
