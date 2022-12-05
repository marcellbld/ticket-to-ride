import React, { useState } from "react";
import { useSelector } from "react-redux";
import { GameStates } from "../../../../domain/game";
import { selectGame } from "../../../../state/game/selector";
import { selectCurrentPlayer, selectLocalPlayer } from "../../../../state/players/selector";
import TicketDeckModal from "./TicketDeckModal";

function TicketDeckPanel({ setShowTicketCities, changeShowNotificationModal }) {
  const [showModal, setShowModal] = useState(false);

  const game = useSelector(selectGame)

  const currentPlayer = useSelector(selectCurrentPlayer);
  const localPlayer = useSelector(selectLocalPlayer);

  return (
    <>
      <span>Célok húzópaklija</span>
      <button
        className="game-card card my-2 mx-1 p-0 border"
        style={{ backgroundColor: "#333333" }}
        onClick={() => {
          if(game.gameState === GameStates.USER_BEGIN && localPlayer === currentPlayer){
            setShowModal(true);
          } else {
            changeShowNotificationModal("Most nem tudsz új célokat húzni.");
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
          ></span>
        </span>
      </button>
      {showModal && (
        <TicketDeckModal
          setShowModal={setShowModal}
          setShowTicketCities={setShowTicketCities}
        />
      )}
    </>
  );
}

export default TicketDeckPanel;
