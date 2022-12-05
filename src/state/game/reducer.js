import { GameStates } from "../../domain/game";
import { NEXT_TURN, SET_END_TURN, SET_GAME, SET_GAME_STATE } from "./actions";

const initialState = {};

export function gameReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_GAME:
      return payload;
    case SET_GAME_STATE:
      return { ...state, gameState: payload };
    case NEXT_TURN:
      const nextPlayerId = (state.currentPlayerId + 1) % state.playerNumber;
      return {
        ...state,
        currentPlayerId: nextPlayerId,
        gameState: GameStates.USER_BEGIN,
      };
    case SET_END_TURN:
      return { ...state, endTurn: payload };
    default:
      return state;
  }
}
