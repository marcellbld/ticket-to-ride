import { currentSocketId } from "../socket/reducer";

export function selectPlayers(state) {
  return state.players;
}

export function selectCurrentPlayer(state) {
  return selectPlayers(state)[state.game.currentPlayerId];
}

export function selectLocalPlayer(state) {
  return selectPlayers(state).find(p => p.socketId === currentSocketId());
}

export function selectAllBuiltConnections(state) {
  const players = selectPlayers(state);

  const builtConnections = [];
  for (let player of players) {
    if (player.builtConnections.length > 0) {
      builtConnections.push({
        color: player.color,
        connections: player.builtConnections,
      });
    }
  }
  return builtConnections;
}
