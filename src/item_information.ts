import { SystemRange, SystemRangeUnit } from "./system_information"

/**
 * This class is a very special one, it represents the information that items
 * can have. It is special because not all systems will have support for all the
 * values, i.e. there is no sense in having the `magical` property relevant
 * inside of a sci-fi system.
 *
 * When using these values, we have to take into account that the value may not
 * exist, and because of that all the values are either booleans or objects that
 * can be represented by null, take that into consideration when using these
 * values. Do things if the value is set/true, skip the functionality if the
 * value is unset/false.
 */
export class ItemInformation {
  /**
   * Basic information that is always get the same way for all systems
   */
  public basic: {
    /**
     * Name of the item
     */
    name: string,
    /**
     * Reference to the owner of the item
     */
    owner: any,
    /**
     * The image of the item
     */
    image: string,
  }
  /**
   * Physical information used to describe the physical attributes of the item
   */
  public physical: {
    /**
     * How many instance of the item are represented by itself.
     */
    quantity: number,
  }
  /**
   * Special attributes that are used by system rules
   */
  public properties: {
    /**
     * Is this item magical?
     */
    magical: boolean,
    /**
     * Can this item be thrown?
     */
    thrown: boolean,
    /**
     * Does this item returns to its owner?
     */
    returns: boolean,
    /**
     * Does this item have a finesse capability?
     */
    finesse: boolean,
  }
  /**
   * Responsible for representing which materials can be encountered in the
   * item, this will most likely just contain materials that are relevant to
   * the system, so don't expect a full list of materials, but instead a small
   * amount of materials that are different/special enough to be marked by the
   * system
   */
  public material: {
    adamantine: boolean,
    silver: boolean,
  }
  /**
   * Information about the ranges of the item
   */
  public range: {
    /**
     * The melee range of this item, mostly used when the item can be melee or
     * ranged, otherwise prefer to use the melee range from `SystemInformation`
     */
    melee: SystemRange,
    /**
     * The minimun range of this item
     */
    min: SystemRange,
    /**
     * The maximun range of this item
     */
    max: SystemRange,
  }
  /**
   * Ammo information
   */
  public ammo:  {
    /**
     * Whether or not this item has ammo
     */
    has: boolean,
    /**
     * A reference to the item that is used as ammo
     */
    item: any,
    /**
     * The amount of ammo that is consumed when the item is used
     */
    quantity: number,
  }
  /**
   * Represents information about the current state of the item
   */
  public state: {
    /**
     * Is the item currently equipped?
     */
    equipped: boolean,
  }

  /**
   * Creates a new `ItemInformation`, you can pass partial values to this
   * constructor, such as:
   * ```ts
  * let newItemInformation = new ItemInformation();
  * ```
  * @param init Partial
  */
  public constructor(init?: Partial<ItemInformation>) {
    Object.assign(this, init);
  }
}
