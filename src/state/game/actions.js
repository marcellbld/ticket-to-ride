import { ClientMessages, GameActionTypes } from "../../api/socket";
import { GameStates } from "../../domain/game";
import { nextPlayerTurn } from "../players/actions";
import { wsSendMessage } from "../socket/actions";

export const NEXT_TURN = "NEXT_TURN";
export const SET_GAME = "SET_GAME";
export const SET_GAME_STATE = "SET_GAME_STATE";
export const SET_END_TURN = "SET_END_TURN";

function setState(gameState) {
  return {
    type: SET_GAME_STATE,
    payload: gameState,
  };
}

export function setGame(game) {
  return {
    type: SET_GAME,
    payload: game,
  };
}

function setEndGameTurn(endTurn) {
  return {
    type: SET_END_TURN,
    payload: endTurn,
  };
}

function nextTurn() {
  return {
    type: "NEXT_TURN",
  };
}

export function setEndTurn(endTurn, broadcast = false) {
  return (dispatch, getState) => {
    dispatch(setEndGameTurn(endTurn));
    if (broadcast) {
      dispatch(
        wsSendMessage(
          ClientMessages.SYNC_ACTION,
          [
            getState().game.id,
            { type: GameActionTypes.END_TURN, payload: endTurn },
            false,
          ],
          function () {}
        )
      );
    }
  };
}

export function nextGameTurn() {
  return (dispatch, getState) => {
    dispatch(nextTurn());
    dispatch(nextPlayerTurn(getState().game.currentPlayerId));

    const endTurn = getState().game.endTurn;
    const currentPlayer = getState().players.find(
      (player) => player.id === getState().game.currentPlayerId
    );

    if (endTurn > -1 && currentPlayer.round >= endTurn) {
      dispatch(setGameState(GameStates.END_GAME));
    }
  };
}

export function setGameState(gameState) {
  return (dispatch, getState) => {
    dispatch(setState(gameState));

    if (gameState === GameStates.DRAW_CARD2) {
      dispatch(
        wsSendMessage(
          ClientMessages.SYNC_ACTION,
          [getState().game.id, { type: GameActionTypes.NEXT_TURN }, false],
          function () {}
        )
      );
    }
  };
}
