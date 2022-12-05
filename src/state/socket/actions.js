export const WS_SUBSCRIBE = "WS_SUBSCRIBE";
export const WS_UNSUBSCRIBE = "WS_UNSUBSCRIBE";
export const WS_SEND_MESSAGE = "WS_SEND_MESSAGE";

export const wsConnect = (host) => ({ type: "WS_CONNECT", host });
export const wsDisconnect = (host) => ({ type: "WS_DISCONNECT", host });

export const wsSendMessage = (channel, datas, ack) => ({type: WS_SEND_MESSAGE, channel, datas, ack});
export const wsSubscribeChannel = (channel, callback) => ({type:WS_SUBSCRIBE, payload: {channel, callback}})
export const wsUnsubscribeChannel = (channel) => ({type:WS_UNSUBSCRIBE, payload: channel})