import { ClientMessages, GameActionTypes } from "../../api/socket";
import { wsSendMessage } from "../socket/actions";

export const SET_PLAYERS = "SET_PLAYERS";
export const ADD_BUILT_CONNECTION = "ADD_BUILT_CONNECTION";
export const ADD_TICKET = "ADD_TICKET";
export const NEXT_PLAYER_TURN = "NEXT_PLAYER_TURN";
export const ADD_HISTORY = "ADD_HISTORY";
export const ADD_COMPLETED_TICKET = "ADD_COMPLETED_TICKET";

export function setPlayers(players) {
  return {
    type: SET_PLAYERS,
    payload: players,
  };
}

function addBuiltConnectionToPlayer(playerId, connectionId) {
  return {
    type: ADD_BUILT_CONNECTION,
    payload: { playerId, connectionId },
  };
}
export function nextPlayerTurn(currentPlayerId) {
  return {
    type: NEXT_PLAYER_TURN,
    payload: currentPlayerId,
  };
}

function addTicketToPlayer(playerId, ticket) {
  return {
    type: ADD_TICKET,
    payload: { playerId: playerId, ticket },
  };
}

function addHistoryToPlayer(playerId, historyElement) {
  return {
    type: ADD_HISTORY,
    payload: { playerId, historyElement },
  };
}

function addCompletedTicketToPlayer(playerId, ticket) {
  return {
    type: ADD_COMPLETED_TICKET,
    payload: { playerId, ticket },
  };
}

export function addBuiltConnection(playerId, connectionId, broadcast = false) {
  return (dispatch, getState) => {
    dispatch(addBuiltConnectionToPlayer(playerId, connectionId));

    if (broadcast) {
      dispatch(
        wsSendMessage(
          ClientMessages.SYNC_ACTION,
          [
            getState().game.id,
            {
              type: GameActionTypes.ADD_BUILT_CONNECTION,
              payload: { playerId, connectionId },
            },
            true,
          ],
          function () {}
        )
      );
    }
  };
}

export function addTicket(playerId, ticket, broadcast = false) {
  return (dispatch, getState) => {
    dispatch(addTicketToPlayer(playerId, ticket));

    if (broadcast) {
      dispatch(
        wsSendMessage(
          ClientMessages.SYNC_ACTION,
          [
            getState().game.id,
            { type: GameActionTypes.ADD_TICKET, payload: { playerId, ticket } },
            true,
          ],
          function () {}
        )
      );
    }
  };
}

export function addHistory(playerId, historyElement, broadcast = false) {
  return (dispatch, getState) => {
    dispatch(addHistoryToPlayer(playerId, historyElement));

    if (broadcast) {
      dispatch(
        wsSendMessage(
          ClientMessages.SYNC_ACTION,
          [
            getState().game.id,
            {
              type: GameActionTypes.ADD_HISTORY,
              payload: { playerId, historyElement },
            },
            true,
          ],
          function () {}
        )
      );
    }
  };
}

export function addCompletedTicket(playerId, ticket, broadcast = false) {
  return (dispatch, getState) => {
    dispatch(addCompletedTicketToPlayer(playerId, ticket));

    if (broadcast) {
      dispatch(
        wsSendMessage(
          ClientMessages.SYNC_ACTION,
          [
            getState().game.id,
            {
              type: GameActionTypes.ADD_COMPLETED_TICKET,
              payload: { playerId, ticket },
            },
            true,
          ],
          function () {}
        )
      );
    }
  };
}
