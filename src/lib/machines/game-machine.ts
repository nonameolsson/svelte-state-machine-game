export type GameState =
  | { state: "start"; highScore: number }
  | { state: "playing"; highScore: number; score: number; opponents: number }
  | { state: "paused"; highScore: number; score: number; opponents: number }
  | { state: "won"; highScore: number; score: number; opponents: number }
  | { state: "game-over"; highScore: number; score: number; opponents: number };

export type GameEvent = {
  type: "START-GAME" | "ESCAPE" | "END" | "LOOSE" | "WIN-BATTLE" | "WIN-ALL";
};

function setHighScore(highScore: number, score: number): number {
  return score > highScore ? score : highScore;
}

export function gameMachine(state: GameState, event: GameEvent): GameState {
  switch (state.state) {
    case "start":
      if (event.type === "START-GAME") {
        return {
          highScore: state.highScore,
          state: "playing",
          score: 0,
          opponents: 10,
        };
      }
      break;

    case "playing":
      if (event.type === "WIN-ALL") {
        return {
          highScore: setHighScore(state.highScore, state.score),
          state: "won",
          score: state.score + 10,
          opponents: 0,
        };
      }
      if (event.type === "WIN-BATTLE") {
        return {
          ...state,
          score: state.score + Math.floor(Math.random() * 4) + 1,
          opponents: state.opponents - 1,
        };
      }
      if (event.type === "ESCAPE") {
        return {
          ...state,
          state: "paused",
        };
      }
      if (event.type === "END") {
        return {
          highScore: 0,
          state: "start",
        };
      }
      if (event.type === "LOOSE") {
        return {
          ...state,
          highScore: setHighScore(state.highScore, state.score),
          state: "game-over",
        };
      }
      break;

    case "paused":
      if (event.type === "START-GAME")
        return {
          ...state,
          state: "playing",
        };
      if (event.type === "ESCAPE")
        return {
          ...state,
          state: "playing",
        };
      break;

    case "game-over":
      if (event.type === "START-GAME") {
        return {
          ...state,
          state: "playing",
          score: 0,
          opponents: 10,
        };
      }
      if (event.type === "END") {
        return {
          ...state,
          state: "start",
        };
      }
      break;

    case "won":
      if (event.type === "END") {
        return {
          highScore: setHighScore(state.highScore, state.score),
          state: "start",
        };
      }
      break;

    default:
      return state;
  }
}
