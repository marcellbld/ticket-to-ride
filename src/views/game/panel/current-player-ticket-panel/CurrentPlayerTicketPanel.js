import React from "react";
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti";
import { useSelector } from "react-redux";
import { ticketToRideData } from "../../../../data/ticket-to-ride-data";
import { selectLocalPlayer } from "../../../../state/players/selector";
import TicketCard from "../../TicketCard";

function CurrentPlayerTicketPanel({
  currentTicketShow,
  changeCurrentTicketShow,
  setShowTicketCities,
}) {
  const localPlayer = useSelector(selectLocalPlayer);
  const selectedTicket = localPlayer.tickets[currentTicketShow];
  const ticketData = Object.values(selectedTicket.long ? ticketToRideData.longDestinations : ticketToRideData.destinations)[
    selectedTicket.id
  ];

  const completed = localPlayer.completedTickets.some(ticket => ticket.id === selectedTicket.id);
  return (
    <>
      <div>Aktuális játékos céljai</div>
      <div className="row justify-content-center">
        <button
          type="button"
          className="btn p-0"
          onMouseEnter={() => {
            setShowTicketCities(ticketData);
          }}
          onMouseLeave={() => {
            setShowTicketCities(null);
          }}
        >
          <TicketCard ticketData={ticketData} completed={completed} long={selectedTicket.long}></TicketCard>
        </button>
      </div>
      <div className="row justify-content-between px-4">
        <button
          type="button"
          className="btn text-white"
          onClick={() => {
            changeCurrentTicketShow(-1);
          }}
        >
          <TiArrowLeftThick />
        </button>
        <button
          type="button"
          className="btn text-white"
          onClick={() => {
            changeCurrentTicketShow(1);
          }}
        >
          <TiArrowRightThick />
        </button>
      </div>{" "}
    </>
  );
}

export default CurrentPlayerTicketPanel;
