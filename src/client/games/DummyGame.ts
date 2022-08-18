import { GameCode } from "../GameDirectory";
import { BaseGame } from "../objects/BaseGame";

export type DummyGameState = {}

export class DummyGame extends BaseGame {
  gameCode = GameCode.DUMMY_GAME;

  gameState: DummyGameState;

  init() {}
}