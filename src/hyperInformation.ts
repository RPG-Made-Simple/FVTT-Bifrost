/**
 * Represents a sort of metadate that defines what things the system does by its
 * own, what data exist/lacks inside the system, and many more other things that
 * could be useful for other modules to know. Note that this is not yet complete
 * and will receive changes in the future.
 *
 * Currently we only define if the system does something by default, i.e. if
 * `lighting.changeImg` is `true` then the system already changes the image of
 * lighting items when they are used.
 */
export class HyperInformation {
  /**
   * Information abou the lighting automation provided by the system
   */
  public lighting: {
    /**
     * Does the system does lighting item automations?
     */
    automate: boolean,
    /**
     * Does the system change the image of an item during automation?
     */
    changeImg: boolean,
  } = {
    automate: false,
    changeImg: false
  }

  public constructor(init?: Partial<HyperInformation>) {
    Object.assign(this, init);
  }
}
