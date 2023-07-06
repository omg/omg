type BaseOptionSettings<T> = {
  defaultValue: T;
  value?: T;
}

type DevDescriptive = DescriptiveLike & {
  _?: string;
} | string;

type DescriptiveLike = {
  name: string;
  description?: string;
}

type OptionsLike = DescriptiveLike & {
  tabs: TabLike[];
}

type TabLike = DescriptiveLike & {
  sections: SectionLike[];
}

type SectionLike = DescriptiveLike & {
  options: OptionLike<any>[];
}

type OptionLike<T> = DescriptiveLike & {
  value: T;
  type: string;
}

type ValidationResult = {
  valid: boolean;
  message?: string;
}

abstract class DescriptiveObject implements DescriptiveLike {
  name: string;
  description?: string;

  constructor(descriptive: DevDescriptive) {
    // not really sure what was intended before since it's been months but i hope this is right
    if (typeof descriptive === 'string') {
      this.name = descriptive;
    } else {
      this.name = descriptive.name;
      this.description = descriptive.description;
    }
  }
}

abstract class BaseOption<T> extends DescriptiveObject implements OptionLike<T>  {
  defaultValue: T;
  value: T;

  type: string;

  constructor(descriptive: DevDescriptive, settings: BaseOptionSettings<T>) {
    super(descriptive);

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

  constructor(descriptive: DevDescriptive, settings: BaseOptionSettings<boolean>) {
    super(descriptive, settings);
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

  constructor(descriptive: DevDescriptive, settings: BaseOptionSettings<number>) {
    super(descriptive, settings);
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

  constructor(descriptive: DevDescriptive, settings: BaseOptionSettings<number>) {
    super(descriptive, settings);
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

type NumberRangeOptionSettings = BaseOptionSettings<NumberRange> & {
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

  constructor(descriptive: DevDescriptive, settings: NumberRangeOptionSettings) {
    super(descriptive, settings);

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

  constructor(descriptive: DevDescriptive, settings: NumberRangeOptionSettings) {
    super(descriptive, settings);
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

type StringOptionSettings = BaseOptionSettings<string> & {
  regex?: RegExp;
  minLength?: number;
  maxLength?: number;
}

class StringOption extends BaseOption<string> {
  type = "string";

  regex?: RegExp;
  minLength?: number;
  maxLength?: number;

  constructor(descriptive: DevDescriptive, settings: StringOptionSettings) {
    super(descriptive, settings);

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

type DropdownOptionSettings = BaseOptionSettings<string> & {
  options: string[];
}

class DropdownOption extends BaseOption<string> {
  type = "dropdown";

  options: string[];

  constructor(descriptive: DevDescriptive, settings: DropdownOptionSettings) {
    super(descriptive, settings);

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

class Options extends DescriptiveObject implements OptionsLike {
  tabs: Tab[];

  constructor(descriptive: DevDescriptive, tabs: Tab[]) {
    super(descriptive);
    
    this.tabs = tabs;
  }

  getOption(name: string): BaseOption<any> {
    for (let tab of this.tabs) {
      for (let section of tab.sections) {
        for (let option of section.options) {
          if (option.name === name) return option;
        }
      }
    }
    return null;
  }

  importOptions(options: Options): void {
    for (let newTab of options.tabs) {
      for (let newSection of newTab.sections) {
        for (let newOption of newSection.options) {
          let thisOption = this.getOption(newOption.name);
          if (thisOption === null) continue;
          if (thisOption.type !== newOption.type) continue;
          // careful - object types aren't checked and could have bloated properties from an attacker
          // also careful around null values? but then the type would be wrong because it's null
          if (thisOption.validate(newOption.value).valid) thisOption.value = newOption.value;
        }
      }
    }
  }

  // TODO
  importJSON(_options: OptionsLike): void {
    
  }

  exportOptions(): void {
    
  }

  // probably should rename this - this takes the settings in this object and strips the extra information for use in databases
  toJSON(): void {

  }
}

class Tab extends DescriptiveObject implements TabLike {
  sections: Section[];

  constructor(descriptive: DevDescriptive, sections: Section[]) {
    super(descriptive);

    this.sections = sections;
  }
}

class Section extends DescriptiveObject implements SectionLike {
  options: BaseOption<any>[];

  constructor(descriptive: DevDescriptive, options: BaseOption<any>[]) {
    super(descriptive);

    this.options = options;
  }
}

// options.wordbomb
// options.wordbomb.wordlength
// options.gameplay
// options.general

// Without language support
new Options("Word Bomb", [
  new Tab("Gameplay", [
    new Section("General", [
      new NumberRangeOption("Fuse time", {
        defaultValue: { min: 3, max: 12 },
        minValue: 0.5,
        maxValue: 300
      }),
    ]),
  ])
]);

// Using language support
new Options("options.wordbomb", [
  new Tab("options.gameplay", [
    new Section("options.general", [
      new NumberRangeOption("options.wordbomb.fusetime", {
        defaultValue: { min: 3, max: 12 },
        minValue: 0.5,
        maxValue: 300
      }),
    ]),
  ])
]);

// Using language support but maintaining readability for developers
new Options("options.wordbomb", [ // Word Bomb
  new Tab("options.gameplay", [ // Gameplay
    new Section("options.general", [ // General
      new NumberRangeOption("fusetime", { // Fuse time
        defaultValue: { min: 3, max: 12 },
        minValue: 0.5,
        maxValue: 300
      }),
    ]),
  ])
]);