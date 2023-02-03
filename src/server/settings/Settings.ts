type BasicSetting = {
  key: string;
  value: any;
}

type TabbedBasicSetting = BasicSetting & {
  tab: string;
  section: string;
}

abstract class Setting<T> {
  key: string;
  value: T;

  visible: boolean;

  constructor(key: string, value: T) {
    this.key = key;
    this.value = value;
    this.visible = true;
  }

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

  protected updateVisibility(settings: Settings): void {};
}

class Section {
  name: string;
  settings: Setting<any>[];

  constructor(name: string, settings: Setting<any>[]) {
    this.name = name;
    this.settings = settings;
  }
}

class Tab {
  name: string;
  sections: Section[];

  constructor(name: string, sections: Section[]) {
    this.name = name;
    this.sections = sections;
  }
}

class Settings {
  tabs: Tab[];

  constructor(master: string, tabs: Tab[]) {
    // master is currently a throwaway variable used to identify what kind of settings these are
    this.tabs = tabs;
  }

  getSetting(key: string): Setting<any> {
    for (let tab of this.tabs) {
      for (let section of tab.sections) {
        for (let setting of section.settings) {
          if (setting.key === key) return setting;
        }
      }
    }

    return null;
  }

  // added unsafe because it doesn't check if the settings are different and can be janky in some cases
  importSettingsUnsafe(settingManager: Settings): void {
    // add all the settings from the settingManager to this settingManager if they don't exist or are different
    for (let tab of settingManager.tabs) {
      for (let section of tab.sections) {
        for (let setting of section.settings) {
          let existingSetting = this.getSetting(setting.key);
          if (existingSetting === null) {
            
          } else {
            // TODO check if the setting is different
          }
        }
      }
    }
  }

  importJSON(settings: BasicSetting[]) {
    for (let setting of settings) {
      let existingSetting = this.getSetting(setting.key);
      if (existingSetting !== null) {
        existingSetting.setValue(setting.value);
      }
    }
  }

  // probably should rename this - this takes the settings in this object and turns them into TabbedBasicSettings for use in the frontend
  exportSettings(): TabbedBasicSetting[] {
    let tabbedBasicSettings: TabbedBasicSetting[] = [];

    for (let tab of this.tabs) {
      for (let section of tab.sections) {
        for (let setting of section.settings) {
          tabbedBasicSettings.push({
            tab: tab.name,
            section: section.name,
            key: setting.key,
            value: setting.value,
          });
        }
      }
    }

    return tabbedBasicSettings;
  }

  // probably should rename this - this takes the settings in this object and strips the extra information for use in databases
  toJSON(): BasicSetting[] {
    let basicSettings: BasicSetting[] = [];

    for (let tab of this.tabs) {
      for (let section of tab.sections) {
        for (let setting of section.settings) {
          basicSettings.push({
            key: setting.key,
            value: setting.value,
          });
        }
      }
    }

    return basicSettings;
  }
}