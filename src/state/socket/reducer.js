import * as actions from "./actions";
import io from "socket.io-client";

let socket = null;

export const socketMiddleware = () => (next) => (action) => {
  switch (action.type) {
    case "WS_CONNECT":
      if (socket !== null) {
        socket.close();
      }

      socket = io(action.host, {
        transports: ["websocket", "polling", "flashsocket"],
      });
      break;
    case actions.WS_SUBSCRIBE:
      handleSubscribeToChannel(action.payload);
      break;
    case actions.WS_UNSUBSCRIBE:
      handleUnsubscribeFromChannel(action.payload);
      break;
    case actions.WS_SEND_MESSAGE:
      socket.emit(action.channel, ...action.datas, action.ack);
      break;
    case "WS_DISCONNECT":
      if (socket !== null) {
        socket.close();
      }
      socket = null;
      console.log("websocket closed");
      break;
    default:
      return next(action);
  }
};

export function currentSocketId() {
  return socket ? socket.id : null;
}

function handleSubscribeToChannel({ channel, callback }) {
  socket.on(channel, (data) => callback(data));
}

function handleUnsubscribeFromChannel(channel) {
  socket.removeAllListeners(channel);
}
