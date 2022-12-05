import { ticketToRideData } from "../../data/ticket-to-ride-data";
import {
  ADD_BUILT_CONNECTION,
  ADD_COMPLETED_TICKET,
  ADD_HISTORY,
  ADD_TICKET,
  NEXT_PLAYER_TURN,
  SET_PLAYERS,
} from "./actions";

const initialState = [];

export function playersReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_PLAYERS:
      return payload;
    case NEXT_PLAYER_TURN:
      return nextTurn(state, payload);
    case ADD_TICKET:
      return addTicket(state, payload);
    case ADD_BUILT_CONNECTION:
      return addBuiltConnection(state, payload);
    case ADD_HISTORY:
      return addHistory(state, payload);
    case ADD_COMPLETED_TICKET:
      return addCompletedTicket(state, payload);
    default:
      return state;
  }
}

function addCompletedTicket(state, payload) {
  const { playerId, ticket } = payload;

  const ticketData = Object.values(
    ticket.long
      ? ticketToRideData.longDestinations
      : ticketToRideData.destinations
  )[ticket.id];

  return state.map((player) => {
    if (player.id === playerId) {
      return {
        ...player,
        completedTickets: [...player.completedTickets, ticket],
        points: player.points + +ticketData.value,
      };
    }
    return player;
  });
}

function nextTurn(state, payload) {
  const currentPlayerId = payload;
  return state.map((player) => {
    if (player.id === currentPlayerId) {
      return { ...player, round: player.round + 1 };
    }
    return player;
  });
}

function addTicket(state, payload) {
  const { playerId, ticket } = payload;

  return state.map((player) => {
    if (player.id === playerId) {
      return {
        ...player,
        tickets: [...player.tickets, ticket],
      };
    }
    return player;
  });
}

function addHistory(state, payload) {
  const { playerId, historyElement } = payload;
  return state.map((player) => {
    if (player.id === playerId) {
      return {
        ...player,
        history: [historyElement, ...player.history].slice(0, 2),
      };
    }
    return player;
  });
}

function addBuiltConnection(state, payload) {
  const { playerId, connectionId } = payload;
  const connection = Object.values(ticketToRideData.connections)[
    connectionId - 1
  ];
  const CONNECTION_VALUES = [1, 2, 4, 7, 0, 15, 21];

  return state.map((player) => {
    if (player.id === playerId) {
      return {
        ...player,
        points:
          player.points + CONNECTION_VALUES[connection.elements.length - 1],
        builtConnections: [...player.builtConnections, connectionId],
        remainingCars: player.remainingCars - connection.elements.length,
      };
    }
    return player;
  });
}
