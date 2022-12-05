import { ClientMessages } from "../../api/socket";
import { wsSendMessage } from "../socket/actions";

export const SET_ROOM = "CREATE_ROOM";
export const JOIN_ROOM = "JOIN_ROOM";

export function setRoom(roomId, roomSize, players = []) {
  return {
    type: SET_ROOM,
    payload: { roomId, roomSize, players },
  };
}

export function joinRoom(playerId, playerName, roomId, callback) {
  return (dispatch) => {
    const ack = function (resp) {
      if (resp.status === "ok") {
        dispatch(
          wsSendMessage(ClientMessages.GET_STATE, [roomId], (resp) => {
            const gameRoom = JSON.parse(resp.state);
            gameRoom.players = [...gameRoom.players, {id: playerId, name: playerName}];
            dispatch(
              wsSendMessage(
                ClientMessages.SYNC_STATE,
                [gameRoom.roomId, gameRoom, false],
                function () {}
              )
            );
          })
        );
      }
      callback(resp);
    };
    dispatch(wsSendMessage(ClientMessages.JOIN_ROOM, [roomId], ack));
  };
}

export function createRoom(playerId, playerName, roomSize, callback) {
  return async (dispatch, getState) => {
    dispatch(
      wsSendMessage(ClientMessages.CREATE_ROOM, [roomSize], function (resp) {
        dispatch(setRoom(resp.roomId, roomSize, [{id: playerId, name: playerName}]));
        const lobbyRoom = getState().lobby;

        dispatch(
          wsSendMessage(
            ClientMessages.SYNC_STATE,
            [lobbyRoom.roomId, lobbyRoom, false],
            function () {}
          )
        );

        callback(resp);
      })
    );
  };
}
