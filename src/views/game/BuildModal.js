import { motion } from "framer-motion";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClientMessages, GameActionTypes } from "../../api/socket";
import { ticketToRideData } from "../../data/ticket-to-ride-data";
import { Colors } from "../../domain/colors";
import { removeCard } from "../../state/deck/actions";
import { selectLocalPlayerCards } from "../../state/deck/selector";
import { setEndTurn } from "../../state/game/actions";
import { selectGame } from "../../state/game/selector";
import { addBuiltConnection, addCompletedTicket, addHistory } from "../../state/players/actions";
import { selectCurrentPlayer } from "../../state/players/selector";
import { wsSendMessage } from "../../state/socket/actions";
import { hasConnectionBetweenCities } from "../../util/pathfinder";
import CurrentPlayerCard from "./CurrentPlayerCard";

function BuildModal({ closeModal, buildableConnection }) {
  const currentPlayerCards = useSelector(selectLocalPlayerCards);
  const currentPlayer = useSelector(selectCurrentPlayer);
  const game = useSelector(selectGame);
  const connection = ticketToRideData.connections[buildableConnection];
  const dispatch = useDispatch();

  const combinationData = [];
  const locomotives = Math.min(
    currentPlayerCards.find((card) => card.color === Colors.LOCOMOTIVE).amount,
    connection.elements.length
  );
  if (connection.color === "gray") {
    for (let card of currentPlayerCards.filter((card) => card.color !== Colors.LOCOMOTIVE)) {
      if (
        card.amount > 0 &&
        card.amount + locomotives >= connection.elements.length
      ) {
        const colorTrains = Math.min(card.amount, connection.elements.length);
        const missingTrains = connection.elements.length - colorTrains;

        let len =
          colorTrains + locomotives - (connection.elements.length - 1);

        if(locomotives >= connection.elements.length){
          len--;
        }

        for (let i = 0; i < len; i++) {
          combinationData.push({
            color: card.color,
            amount: connection.elements.length - missingTrains - i,
            locomotives: missingTrains + i,
          });
        }
      }
    }
    
    if(locomotives >= connection.elements.length){
      combinationData.push({
        color: Colors.LOCOMOTIVE,
        amount: 0,
        locomotives: connection.elements.length
      });
    }
  } else {
    const colorTrains = Math.min(
      currentPlayerCards.find(
        (card) => card.color === Colors[connection.color.toUpperCase()]
      ).amount,
      connection.elements.length
    );
    const missingTrains = connection.elements.length - colorTrains;

    const len = colorTrains + locomotives - (connection.elements.length - 1);

    for (let i = 0; i < len; i++) {
      combinationData.push({
        color: Colors[connection.color.toUpperCase()],
        amount: connection.elements.length - missingTrains - i,
        locomotives: missingTrains + i,
      });
    }
  }
  const combinations = combinationData.map(
    ({ color, amount, locomotives }, i) => {
      const cards = [];
      let cardId = 0;
      for (let i = 0; i < amount; i++) {
        cards.push(
          <CurrentPlayerCard
            key={cardId++}
            color={color}
            amount={1}
          ></CurrentPlayerCard>
        );
      }
      for (let i = 0; i < locomotives; i++) {
        cards.push(
          <CurrentPlayerCard
            key={cardId++}
            color={Colors.LOCOMOTIVE}
            amount={1}
          ></CurrentPlayerCard>
        );
      }
      return (
        <div className="d-flex flex-column justify-content-center" key={i}>
          <div className="row">{cards}</div>
          <button
            className="btn button-orange m-auto"
            onClick={() => {
              if (amount > 0) {
                dispatch(removeCard(currentPlayer.id, color, amount));
              }
              if (locomotives > 0) {
                dispatch(
                  removeCard(
                    currentPlayer.id,
                    Colors.LOCOMOTIVE,
                    locomotives
                  )
                );
              }
              dispatch(addBuiltConnection(currentPlayer.id, connection.id, true));
              dispatch(addHistory(currentPlayer.id, "Megépített egy útvonalat: "+ connection.fromCity + " - " + connection.toCity, true));

              for(let ticket of currentPlayer.tickets) {
                if(!currentPlayer.completedTickets.find((t) => t.id === ticket.id)){
                  const ticketData = Object.values(
                    ticket.long
                      ? ticketToRideData.longDestinations
                      : ticketToRideData.destinations
                  )[ticket.id];

                  if(hasConnectionBetweenCities(ticketData.from, ticketData.to, [...currentPlayer.builtConnections, connection.id])){
                    dispatch(addCompletedTicket(currentPlayer.id, ticket, true));
                  }
                }
              }

              if(currentPlayer.remainingCars - connection.elements.length <= 2) {
                dispatch(setEndTurn(currentPlayer.round+2, true));
              }

              dispatch(wsSendMessage(ClientMessages.SYNC_ACTION, [game.id, {type: GameActionTypes.NEXT_TURN}, false], function() {}));
              
              closeModal();
            }}
          >
            Választ
          </button>
        </div>
      );
    }
  );
  return (
    <>
      <motion.div
        className="position-absolute w-100 h-100 d-flex flex-col justify-content-center align-items-center"
        style={{
          backgroundColor: "#00000088",
          top: 0,
          left: 0,
          zIndex: 999,
          opacity: 0,
        }}
        animate={{ opacity: 1 }}
      >
        <div className="row">
          <div className="col">{combinations}</div>
        </div>
      </motion.div>
    </>
  );
}

export default BuildModal;
