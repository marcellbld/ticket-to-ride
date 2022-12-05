export const ClientMessages = {
  JOIN_ROOM: "join-room",
  CREATE_ROOM: "create-room",
  CLOSE_ROOM: "close-room",
  LEAVE_ROOM: "leave-room",
  SYNC_STATE: "sync-state",
  SYNC_ACTION: "sync-action",
  GET_STATE: "get-state",
};
export const GameActionTypes = {
  NEXT_TURN: "NEXT_TURN",
  ADD_BUILT_CONNECTION: "ADD_BUILT_CONNECTION",
  ADD_TICKET: "ADD_TICKET",
  ADD_HISTORY: "ADD_HISTORY",
  ADD_COMPLETED_TICKET: "ADD_COMPLETED_TICKET",
  UPDATE_CARD: "UPDATE_CARD",
  REMOVE_CARD: "REMOVE_CARD",
  END_TURN: "END_TURN"
};
export const ServerMessages = {
  ROOM_IS_FULL: "room-is-full",
  PLAYER_JOINED: "player-joined",
  STATE_CHANGED: "state-changed",
  ACTION_SENT: "action-sent",
  PLAYER_LEFT: "player-left",
};