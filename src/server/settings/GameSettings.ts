// this is basically the same for Section, Tab, and Setting - should name this something to encompass them all
abstract class Descriptive {
  name: string;
  descriptor?: string;

  constructor(name: string, descriptor: string) {
    this.name = name;
    this.descriptor = descriptor;
  }
}

type ValidationResult = {
  valid: boolean;
  message?: string;
}

type OptionSettings<T> = {
  defaultValue: T;
  value: T;
}

// this is sent to clients and then converted into a Setting<T>
// tabs, sections, and settings are all automatically created on the client

// if tabs and sections are automatically created based on JSONOptions, then how do Descriptive objects work with them?
// maybe we should just send the settings a different way
type JSONOption<T> = OptionSettings<T> & {
  type: string;
}

abstract class BaseOption<T> extends Descriptive implements JSONOption<T>  {
  defaultValue: T;
  value: T;

  type: string;

  constructor(name: string, descriptor: string, settings: OptionSettings<T>) {
    super(name, descriptor);

    this.defaultValue = settings.defaultValue;
    this.value = settings.value || settings.defaultValue;
  }

  abstract validate(value: any): ValidationResult;

  // clean(value: T) {
  //   return value;
  // }
}

class BooleanOption extends BaseOption<boolean> {
  type = "boolean";

  constructor(name: string, descriptor: string, settings: OptionSettings<boolean>) {
    super(name, descriptor, settings);
  }

  validate(value: any): ValidationResult {
    if (typeof value !== 'boolean') {
      return { valid: false, message: 'option.boolean.invalid' };
    }
    return { valid: true };
  }
}

class NumberOption extends BaseOption<number> {
  type = "number";

  constructor(name: string, descriptor: string, settings: OptionSettings<number>) {
    super(name, descriptor, settings);
  }

  validate(value: any): ValidationResult {
    if (typeof value !== 'number') {
      return { valid: false, message: 'option.number.invalid' };
    }
    return { valid: true };
  }
}

class IntegerOption extends NumberOption {
  type = "integer";

  constructor(name: string, descriptor: string, settings: OptionSettings<number>) {
    super(name, descriptor, settings);
  }

  validate(value: any): ValidationResult {
    const result = super.validate(value);
    if (!result.valid) {
      return result;
    }
    if (value % 1 !== 0) {
      return { valid: false, message: 'option.integer.invalid' };
    }
    return { valid: true };
  }
}

type NumberRange = {
  min: number;
  max: number;
}

type NumberRangeOptionSettings = OptionSettings<NumberRange> & {
  minValue: number;
  maxValue: number;
  minDifference?: number;
  maxDifference?: number;
}

class NumberRangeOption extends BaseOption<NumberRange> {
  type = "numberRange";

  minValue: number;
  maxValue: number;
  minDifference?: number;
  maxDifference?: number;

  constructor(name: string, descriptor: string, settings: NumberRangeOptionSettings) {
    super(name, descriptor, settings);

    this.minValue = settings.minValue;
    this.maxValue = settings.maxValue;
    this.minDifference = settings.minDifference;
    this.maxDifference = settings.maxDifference;
  }

  validate(value: any): ValidationResult {
    if (typeof value !== 'object') {
      return { valid: false, message: 'option.numberRange.invalid' };
    }

    const { min, max } = value;
    if (typeof min !== 'number' || typeof max !== 'number') {
      return { valid: false, message: 'option.numberRange.invalid' };
    }

    if (min < this.minValue) {
      return { valid: false, message: 'option.numberRange.mintoolow' };
    }
    if (max > this.maxValue) {
      return { valid: false, message: 'option.numberRange.maxtoohigh' };
    }

    if (min > max) {
      return { valid: false, message: 'option.numberRange.minovermax' };
    }

    if (this.minDifference !== undefined && max - min < this.minDifference) {
      return { valid: false, message: 'option.numberRange.underdifference' };
    }
    if (this.maxDifference !== undefined && max - min > this.maxDifference) {
      return { valid: false, message: 'option.numberRange.overdifference' };
    }

    return { valid: true };
  }
}

class IntegerRangeOption extends NumberRangeOption {
  type = "integerRange";

  constructor(name: string, descriptor: string, settings: NumberRangeOptionSettings) {
    super(name, descriptor, settings);
  }

  validate(value: any): ValidationResult {
    const result = super.validate(value);
    if (!result.valid) {
      return result;
    }

    const { min, max } = value;
    if (min % 1 !== 0 || max % 1 !== 0) {
      return { valid: false, message: 'option.integerRange.invalid' };
    }

    return { valid: true };
  }
}

type StringOptionSettings = OptionSettings<string> & {
  regex?: RegExp;
  minLength?: number;
  maxLength?: number;
}

class StringOption extends BaseOption<string> {
  type = "string";

  regex?: RegExp;
  minLength?: number;
  maxLength?: number;

  constructor(name: string, descriptor: string, settings: StringOptionSettings) {
    super(name, descriptor, settings);

    this.regex = settings.regex;
    this.minLength = settings.minLength;
    this.maxLength = settings.maxLength;
  }

  validate(value: any): ValidationResult {
    if (typeof value !== 'string') {
      return { valid: false, message: 'option.string.invalid' };
    }

    if (this.regex && !this.regex.test(value)) {
      return { valid: false, message: 'option.string.invalid' };
    }

    if (this.minLength !== undefined && value.length < this.minLength) {
      return { valid: false, message: 'option.string.tooshort' };
    }
    if (this.maxLength !== undefined && value.length > this.maxLength) {
      return { valid: false, message: 'option.string.toolong' };
    }

    return { valid: true };
  }
}

type DropdownOptionSettings = OptionSettings<string> & {
  options: string[];
}

class DropdownOption extends BaseOption<string> {
  type = "dropdown";

  options: string[];

  constructor(name: string, descriptor: string, settings: DropdownOptionSettings) {
    super(name, descriptor, settings);

    this.options = settings.options;
  }

  validate(value: any): ValidationResult {
    if (typeof value !== 'string') {
      return { valid: false, message: 'option.dropdown.invalid' };
    }

    if (!this.options.includes(value)) {
      return { valid: false, message: 'option.dropdown.invalid' };
    }

    return { valid: true };
  }
}

// there is no such thing as a "defined setting".
// every setting is defined at the start of the app and defines the restrctions on each setting and has a value (the default value)
// these settings are cloned into game settings when a lobby is created with a game
// then the users can modify it