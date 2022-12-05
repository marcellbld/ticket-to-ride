import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClientMessages } from "../../../../api/socket";
import { Colors } from "../../../../domain/colors";
import { GameStates } from "../../../../domain/game";
import { updateCard } from "../../../../state/deck/actions";
import {
  selectFreeCards,
  selectTopCardOfDeck,
} from "../../../../state/deck/selector";
import { setGameState } from "../../../../state/game/actions";
import { selectGame } from "../../../../state/game/selector";
import { addHistory } from "../../../../state/players/actions";
import { selectCurrentPlayer, selectLocalPlayer } from "../../../../state/players/selector";
import { wsSendMessage } from "../../../../state/socket/actions";

function DeckPanel() {
  const dispatch = useDispatch();
  const freeCardsNumber = useSelector(selectFreeCards).length;
  const topCardOfDeck = useSelector(selectTopCardOfDeck);
  const currentPlayer = useSelector(selectCurrentPlayer);
  const game = useSelector(selectGame);

  const localPlayer = useSelector(selectLocalPlayer);

  return (
    <>
      <span>Húzópakli</span>
      <button
        className="game-card card my-2 mx-1 p-0 border"
        style={{ backgroundColor: "#333333" }}
        onClick={() => {
          if (
            (game.gameState === GameStates.USER_BEGIN ||
            game.gameState === GameStates.DRAW_CARDS) && currentPlayer === localPlayer
          ) {
            dispatch(
              updateCard({ ...topCardOfDeck, cardState: currentPlayer.id })
            );
            dispatch(addHistory(currentPlayer.id, "Kártyát húzott: "+Object.keys(Colors).find(c => Colors[c] === topCardOfDeck.color)));
            dispatch(
              setGameState(
                game.gameState === GameStates.USER_BEGIN
                  ? GameStates.DRAW_CARDS
                  : GameStates.DRAW_CARD2
              )
            );
            dispatch(wsSendMessage(ClientMessages.SYNC_STATE, [game.id, {game: game}, true], function() {} ));
          }
        }}
      >
        <span
          className="game-card card w-100 h-100 border"
          style={{ backgroundColor: "#333333", top: "-0.2rem" }}
        >
          <span
            className="game-card card w-100 h-100 border-0"
            style={{ backgroundColor: "#999999", top: "-0.2rem" }}
          >
            {freeCardsNumber}
          </span>
        </span>
      </button>
    </>
  );
}

export default DeckPanel;
