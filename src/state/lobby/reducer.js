import { SET_ROOM } from "./actions";

const initialState = {
  roomId: -1,
  roomSize: -1,
  players: [],
};

export function lobbyReducer(state = initialState, action) {
  const { type, payload } = action;
  let newState;
  switch (type) {
    case SET_ROOM:
      const { roomId, roomSize, players } = payload;
      newState = { roomId, roomSize, players };
      break;
    default:
      newState = state;
      break;
  }
  return newState;
}