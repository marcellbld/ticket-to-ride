import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClientMessages, GameActionTypes } from "../../../../api/socket";
import { ticketToRideData } from "../../../../data/ticket-to-ride-data";
import { selectGame } from "../../../../state/game/selector";
import { addHistory, addTicket } from "../../../../state/players/actions";
import { selectCurrentPlayer, selectPlayers } from "../../../../state/players/selector";
import { wsSendMessage } from "../../../../state/socket/actions";
import TicketCard from "../../TicketCard";

function TicketDeckModal({ setShowModal, setShowTicketCities }) {
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [ticketDatas, setTicketDatas] = useState([]);

  const dispatch = useDispatch();
  const currentPlayer = useSelector(selectCurrentPlayer);
  const game = useSelector(selectGame);
  const players = useSelector(selectPlayers);

  useEffect(() => {
    const datas = [];
    for (let i = 0; i < 3; i++) {
      const id = Math.floor(Math.random() * 46);
      const long = id >= 40;
      datas.push({ id: long ? id - 40 : id, long });
    }
    
    setTicketDatas(datas);
  }, [dispatch]);

  const ticketElements = ticketDatas.map((data, i) => {
    const ticketData = Object.values(
      data.long
        ? ticketToRideData.longDestinations
        : ticketToRideData.destinations
    )[data.id];

    return (
      <motion.a
        key={i}
        className="btn mx-4"
        variants={{ selected: { scale: 1.2 }, simple: { scale: 1 } }}
        animate={
          selectedTickets.findIndex(t => t === i) > -1 ? "selected" : "simple"
        }
        transition={{ duration: 1 }}
        onClick={() => {
          const findId = selectedTickets.findIndex((t) => t === i);
          if (findId > -1) {
            selectedTickets.splice(findId, 1);
            setSelectedTickets([...selectedTickets]);
          } else {
            setSelectedTickets([...selectedTickets, i]);
          }
        }}
        onMouseEnter={() => {
          setShowTicketCities(ticketData);
        }}
        onMouseLeave={() => {
          setShowTicketCities(null);
        }}
      >
        <TicketCard
          ticketData={ticketData}
          long={data.long}
          completed={false}
        ></TicketCard>
      </motion.a>
    );
  });


  return (
    <>
      <div
        className="position-absolute w-100 h-100 d-flex flex-col align-items-end"
        style={{
          backgroundColor: "#00000022",
          top: 0,
          left: 0,
          zIndex: 999,
        }}
      >
        <motion.div
          className="col py-4"
          style={{
            backgroundColor: "#00000088",
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
        >
          <div>{ticketElements}</div>
          <div className="mt-4">
            <button
              type="button"
              className="btn button-orange"
              onClick={() => {
                for (let selectedTicket of selectedTickets) {
                  dispatch(addTicket(currentPlayer.id, {id: ticketDatas[selectedTicket].id, long: ticketDatas[selectedTicket].long}, true));
                }
                setShowModal(false);
                dispatch(addHistory(currentPlayer.id, selectedTickets.length + " db új célkártyát húzott", true));
                dispatch(wsSendMessage(ClientMessages.SYNC_ACTION, [game.id, {type: GameActionTypes.NEXT_TURN}, false], function() {}));
                dispatch(wsSendMessage(ClientMessages.SYNC_STATE, [game.id, {players, game}, true], function() {} ));
              }}
              disabled={selectedTickets.length === 0}
            >
              Elfogad
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default TicketDeckModal;
