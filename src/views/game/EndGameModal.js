import { motion } from "framer-motion";
import React from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ClientMessages } from "../../api/socket";
import { ticketToRideData } from "../../data/ticket-to-ride-data";
import { AppStates } from "../../domain/app";
import { selectGame } from "../../state/game/selector";
import { selectPlayers } from "../../state/players/selector";
import { wsSendMessage } from "../../state/socket/actions";

function EndGameModal({ setAppState, showTicketCities, setShowTicketCities }) {
  const players = useSelector(selectPlayers);
  const dispatch = useDispatch();
  const game = useSelector(selectGame);

  const summaryComponents = players.map((player, i) => {

    const ticketsValues = player.tickets.reduce((sum, ticket) => {
      const ticketData = Object.values(
        ticket.long
          ? ticketToRideData.longDestinations
          : ticketToRideData.destinations
      )[ticket.id];
      const contains = player.completedTickets.includes(ticket);
      return sum + (contains ? +ticketData.value : -+ticketData.value);
    }, 0);

    const tickets = player.tickets.map((ticket, j) => {
      const ticketData = Object.values(
        ticket.long
          ? ticketToRideData.longDestinations
          : ticketToRideData.destinations
      )[ticket.id];

      return (
        <span
          key={j}
          className="mx-1 d-inline-block"
          style={{
            backgroundColor: player.completedTickets.find(
              (t) => t.id === ticket.id && t.long === ticket.long
            )
              ? "green"
              : "red",
            width: "1.5rem",
            height: "1rem",
          }}
          onMouseEnter={() => setShowTicketCities(ticketData)}
          onMouseLeave={() => setShowTicketCities(null)}
        ></span>
      );
    });

    return (
      <tr key={i}>
        <td className="text-left">
          <FaUser color={player.color} /> {player.name}
        </td>
        <td className="text-center">{player.points + ticketsValues}</td>
        <td className="text-center px-5">
          <div>{ticketsValues}</div>
          <div className="text-left">{tickets}</div>
        </td>
      </tr>
    );
  });

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
        animate={{ opacity: showTicketCities ? 0.2 : 1 }}
      >
        <div className="row">
          <div className="col">
            <div className="card card-login mx-auto text-center">
              <div className="card-header mx-auto">
                <span className="logo_title mt-5">Játék vége</span>
              </div>
              <div className="card-body">
                <table className="">
                  <thead className="text-white">
                    <tr>
                      <th>Név</th>
                      <th>Utak pontértéke</th>
                      <th>Célok pontértéke</th>
                    </tr>
                  </thead>
                  <tbody>{summaryComponents}</tbody>
                </table>
                <button
                  type="button"
                  className="btn button-silver"
                  onClick={() => {
                    
                    dispatch(wsSendMessage(ClientMessages.LEAVE_ROOM, [game.id], function() {
                      setAppState(AppStates.MAIN_PAGE);
                    } ));
                  }
                  }
                >
                  Vissza a főmenübe
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default EndGameModal;
