export enum SystemRangeUnit {
  /**
   * Represents an invalid range, generally used when the range is not defined
   * or not valid
   */
  Invalid = "INVALID",
  Foot = "FOOT",
  Meter = "METER",
}

/**
 * Defines a range that has a unit and number
 */
export class SystemRange {
  public readonly unit: SystemRangeUnit;
  public readonly value: number;

  /**
   * Returns a new SystemRange
   * @param unit
   * @param value
   */
  constructor(unit: SystemRangeUnit, value: number) {
    this.unit = unit;
    this.value = value;
  }
}

export class SystemInformation {
  public range: {
    /**
     * Default melee range for this system, this defines a unit and a number to
     * serve as a default range checker, can be useful for modules that automate
     * attacks or need to check melee distances.
     */
    melee: SystemRange,
  } = {
    melee: new SystemRange(SystemRangeUnit.Invalid, -1),
  }

  /**
   * Creates a new `SystemInformation`, you can pass partial values to this
   * constructor, such as:
   * ```ts
  * let newSystemInformation = new SystemInformation();
  * ```
  * @param init Partial
  */
  public constructor(init?: Partial<SystemInformation>) {
    Object.assign(this, init);
  }
}
