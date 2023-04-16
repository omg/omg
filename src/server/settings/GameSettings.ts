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

type SettingDefinitionSchema<T> = {
  defaultValue: T;
}

type DefinedSettingSchema<T> = SettingDefinitionSchema<T> & {
  value: T;
}

// this is sent to clients and then converted into a Setting<T>
// tabs, sections, and settings are all automatically created on the client
type JSONSetting<T> = DefinedSettingSchema<T> & {
  tab: string;
  section: string;
  setting: string;

  index: number;
}

abstract class SettingDefinition<T> extends Descriptive {
  defaults: SettingDefinitionSchema<T>;

  constructor(name: string, descriptor: string, defaults: SettingDefinitionSchema<T>) {
    super(name, descriptor);
    this.defaults = defaults;
  }

  abstract validate(value: any): ValidationResult;

  clean(value: T) {
    return value;
  }
}

abstract class DefinedSetting<T> extends SettingDefinition<T> {
  value: T;

  constructor(name: string, descriptor: string, defaults: SettingDefinitionSchema<T>, value: T) {
    super(name, descriptor, defaults);
    this.value = value;
  }
}

class BooleanSettingDefinition extends SettingDefinition<boolean> {
  constructor(name: string, descriptor: string, defaults: SettingDefinitionSchema<boolean>) {
    super(name, descriptor, defaults);
  }

  validate(value: any): ValidationResult {
    if (typeof value !== 'boolean') {
      return {
        valid: false,
        message: 'Value must be a boolean'
      }
    }
    return { valid: true }
  }
}

// there is no such thing as a "defined setting".
// every setting is defined at the start of the app and defines the restrctions on each setting and has a value (the default value)
// these settings are cloned into game settings when a lobby is created with a game
// then the users can modify it