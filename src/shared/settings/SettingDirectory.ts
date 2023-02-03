export type DirectorySetting<T> = {
  defaultValue: T;
  name: string;
  description: string;
  
}

export type SettingDirectory = {
  [key: string]: DirectorySetting<any>;
}


export const SettingDirectory: SettingDirectory = {

}