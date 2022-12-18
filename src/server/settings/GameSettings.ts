import { GameCode } from "../GameDirectory";

// // could upgrade to a class later - but right now no special methods are required
// export type GameSettings = {
//   // TODO let the game decide if the teams or minPlayers should be modifiable
//   // TODO where do maxPlayers fit? gamesettings? room?
//   // one of the prior AND lobby?

//   gameCode: GameCode;
  
//   minPlayers: number;

//   //teams: Team[]; ?? TODO Where do teams go????

//   //mods: Mod[];
//   //gameOptions: any; ?? TODO
//   //teamBalancing: boolean;
//   //minPlayers: number;
//   //map from Crashgrid
// }

// what about a list where you can add new strings

export type SettingSchema<T> = {
  key: string;

  tab: string;
  section: string;
  index: number;

  value: T,

  // settings that are enabled when this setting is enabled
  enabledSettings?: Setting<any>[];
}

export abstract class Setting<T> {
  key: string;
  
  tab: string;
  section: string;
  index: number;

  value: T;
  
  enabledSettings?: Setting<any>[]; // this shouldn't be in Setting, it only works for boolean and list settings

  constructor(settingSchema: SettingSchema<T>) {
    this.key = settingSchema.key;
    this.tab = settingSchema.tab;
    this.section = settingSchema.section;
    this.index = settingSchema.index;
    this.value = settingSchema.value;
    this.enabledSettings = settingSchema.enabledSettings;
  }
  
  //type: SettingType;
  abstract validate(value: any): boolean;
  clean(value: T): T {
    return value;
  }

  setValue(value: T): boolean {
    let validationResult = this.validate(value);
    if (!validationResult) return validationResult;

    this.value = this.clean(value);

    return true;
  }
}

export type NumberSettingSchema = SettingSchema<number> & {
  min?: number;
  max: number;
}

export class NumberSetting extends Setting<number> {
  min: number;
  max: number;

  constructor(settingSchema: NumberSettingSchema) {
    super(settingSchema);

    this.min = settingSchema.min ?? 0;
    this.max = settingSchema.max;
  }

  validate(value: any): boolean {
    if (typeof value !== "number") return false;
    if (value < this.min) return false;
    if (value > this.max) return false;
    return true;
  }
}

export class IntegerSetting extends NumberSetting {
  validate(value: any): boolean {
    let superValidationResult = super.validate(value);
    if (!superValidationResult) return superValidationResult;

    // check if the value is an integer
    if (!Number.isInteger(value)) return false;

    return true;
  }
}

export type NumberRange = {
  minValue: number;
  maxValue: number;
}

export type RangeSettingSchema = SettingSchema<NumberRange> & {
  min: number;
  max: number;
  minDifference?: number;
  maxDifference?: number;
}

// range setting - min and max values are numbers with min and max values on the min and max values
export class RangeSetting extends Setting<NumberRange> {
  min: number;
  max: number;
  minDifference: number;
  maxDifference: number;

  constructor(settingSchema: RangeSettingSchema) {
    super(settingSchema);

    this.min = settingSchema.min;
    this.max = settingSchema.max;
    this.minDifference = settingSchema.minDifference;
    this.maxDifference = settingSchema.maxDifference;
  }

  validate(value: any): boolean {
    // check if the value is a NumberRange
    if (typeof value !== "object") return false;
    if (typeof value.minValue !== "number") return false;
    if (typeof value.maxValue !== "number") return false;
    
    // check if the min is correctly set
    if (value.minValue > value.maxValue) return false;

    // check if the min and max are in range
    if (value.minValue < this.min) return false;
    if (value.maxValue > this.max) return false;

    // check if the difference is correct
    if (this.minDifference && value.maxValue - value.minValue < this.minDifference) return false;
    if (this.maxDifference && value.maxValue - value.minValue > this.maxDifference) return false;

    return true;
  }

  clean(value: NumberRange): NumberRange {
    return {
      minValue: value.minValue,
      maxValue: value.maxValue
    }
  }
}

export class BooleanSetting extends Setting<boolean> {
  validate(value: any): boolean {
    if (typeof value !== "boolean") return false;
    return true;
  }
}

export type StringSettingSchema = SettingSchema<string> & {
  regex?: RegExp;
  minLength?: number;
  maxLength: number;
}

export class StringSetting extends Setting<string> {
  regex?: RegExp;
  minLength?: number;
  maxLength: number;

  constructor(settingSchema: StringSettingSchema) {
    super(settingSchema);

    this.regex = settingSchema.regex;
    this.minLength = settingSchema.minLength;
    this.maxLength = settingSchema.maxLength;
  }

  validate(value: any): boolean {
    if (typeof value !== "string") return false;
    if (this.minLength && value.length < this.minLength) return false;
    if (value.length > this.maxLength) return false;
    if (this.regex && !this.regex.test(value)) return false;
    return true;
  }
}

export type DropdownSettingSchema<T> = SettingSchema<T> & {
  options: T[];
}

export class DropdownSetting<T> extends Setting<T> {
  options: T[];

  constructor(settingSchema: DropdownSettingSchema<T>) {
    super(settingSchema);

    this.options = settingSchema.options;
  }

  validate(value: any): boolean {
    if (!this.options.includes(value)) return false;
    return true;
  }
}

// export type SettingFactory = {
//   [key: string
// ]: (settingSchema: SettingSchema<any>) => Setting<any>
// }

export const SettingFactory = {
  number: (settingSchema: NumberSettingSchema) => new NumberSetting(settingSchema),
  integer: (settingSchema: NumberSettingSchema) => new IntegerSetting(settingSchema),
  boolean: (settingSchema: SettingSchema<boolean>) => new BooleanSetting(settingSchema),
  string: (settingSchema: StringSettingSchema) => new StringSetting(settingSchema),
  dropdown: (settingSchema: DropdownSettingSchema<any>) => new DropdownSetting(settingSchema),
}

// SettingFactory.number({
//   key: "rechargeCooldown",
//   tab: "Gameplay",
//   section: "General",
//   index: 0,
//   value: 5,
//   min: 0,
//   max: 10,
// });

// rangesetting

// export abstract class GameSettings {
//   gameCode: GameCode;


//   constructor() {
//     this.gameCode = gameSettings.gameCode;
//     this.minPlayers = gameSettings.minPlayers;
//   }
// }