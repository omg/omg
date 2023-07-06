const DIRECTORY = {
  ["DummyGame"]: {
    // Game: DummyGame,
    name: "Dummy Game",

    minPlayers: 2,
    // getDefaultTeams() { // should this be here?
    //   return [];
    // }
  },
} as const;

export type BaseDirectoryGame = {
  // Game: typeof Game;
  name: string;
};

export type BaseDirectoryInformation = { [key in keyof typeof DIRECTORY]: BaseDirectoryGame };
// turn the DIRECTORY into an enum automatically using the keys of the object
export type GameCode = keyof typeof DIRECTORY;
export const BaseGameDirectory: BaseDirectoryInformation = DIRECTORY;

// let dg: DummyGame = new GameDirectory.DummyGame.game();