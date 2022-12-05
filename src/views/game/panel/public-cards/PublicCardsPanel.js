import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClientMessages } from "../../../../api/socket";
import { CardStates } from "../../../../domain/card";
import { Colors } from "../../../../domain/colors";
import { GameStates } from "../../../../domain/game";
import { updateCard } from "../../../../state/deck/actions";
import { selectPublicCards } from "../../../../state/deck/selector";
import { setGameState } from "../../../../state/game/actions";
import { selectGame } from "../../../../state/game/selector";
import { addHistory } from "../../../../state/players/actions";
import {
  selectCurrentPlayer,
  selectLocalPlayer,
} from "../../../../state/players/selector";
import { wsSendMessage } from "../../../../state/socket/actions";
import Card from "../../Card";

function PublicCardsPanel({ changeShowNotificationModal }) {
  const cards = useSelector(selectPublicCards);
  const game = useSelector(selectGame);
  const [waiting, setWaiting] = useState(false);

  const currentPlayer = useSelector(selectCurrentPlayer);
  const localPlayer = useSelector(selectLocalPlayer);
  const dispatch = useDispatch();

  const cardsComponents = [...Array(5).keys()].map((i) => {
    const cardData = cards.find(
      (card) => card.cardState === CardStates.PUBLIC[i]
    );
    return (
      <Card
        key={i}
        cardData={cardData}
        clickable={!waiting}
        onClick={() => {
          if (waiting || !cardData) return;

          if (
            (currentPlayer === localPlayer &&
              game.gameState === GameStates.USER_BEGIN) ||
            (game.gameState === GameStates.DRAW_CARDS &&
              cardData.color !== Colors.LOCOMOTIVE)
          ) {
            setTimeout(() => {
              dispatch(
                addHistory(
                  currentPlayer.id,
                  "Kártyát húzott: " +
                    Object.keys(Colors).find(
                      (c) => Colors[c] === cardData.color
                    )
                )
              );
              dispatch(
                updateCard({ ...cardData, cardState: currentPlayer.id })
              );
              setWaiting(false);
            }, 250);
            setWaiting(true);
            dispatch(
              setGameState(
                game.gameState === GameStates.USER_BEGIN
                  ? cardData.color === Colors.LOCOMOTIVE
                    ? GameStates.DRAW_CARD2
                    : GameStates.DRAW_CARDS
                  : GameStates.DRAW_CARD2
              )
            );
            dispatch(
              wsSendMessage(
                ClientMessages.SYNC_STATE,
                [
                  game.id,
                  { game: game },
                  true,
                ],
                function () {}
              )
            );
            return true;
          } else {
            changeShowNotificationModal("Most nem tudsz új kártyát húzni.");
          }
          return false;
        }}
      ></Card>
    );
  });

  return (
    <div className="row">
      <div className="mx-auto">Felfedett vasútkocsi-kártyák</div>
      <div className="my-2 p-0 mx-auto">{cardsComponents}</div>
    </div>
  );
}

export default PublicCardsPanel;
