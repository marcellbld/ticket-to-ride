import React from "react";
import { useSelector } from "react-redux";
import { selectAllPlayerCards } from "../../../../state/deck/selector";
import {
  selectCurrentPlayer,
  selectPlayers,
} from "../../../../state/players/selector";
import PlayerIndicator from "./PlayerIndicator";

function PlayerIndicatorPanel() {
  const players = useSelector(selectPlayers);
  const currentPlayer = useSelector(selectCurrentPlayer);
  const allPlayerCards = useSelector(selectAllPlayerCards);

  const playerIndicators = players.map((player, i) => (
    <PlayerIndicator
      key={i}
      player={player}
      active={player === currentPlayer}
      cards={allPlayerCards.find((cards) => cards.playerId === player.id).cards}
    ></PlayerIndicator>
  ));
  return (
    <div>
      <span>Játékosok</span>
      {playerIndicators}
    </div>
  );
}

export default PlayerIndicatorPanel;
