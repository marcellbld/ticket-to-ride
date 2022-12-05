import React from "react";
import { GiPokerHand } from "react-icons/gi";
import { BiTrain } from "react-icons/bi";
import { IoTicket } from "react-icons/io5";
import { FaUser, FaClock } from "react-icons/fa";
import classNames from "classnames";

function PlayerIndicator({ player, active, cards }) {
  const cardSum = cards.reduce((sum, {_, amount}) => sum + amount,0);
  return (
    <div className={classNames('card', 'my-2', 'py-1', {'active': active})}>
      <div className="row justify-content-between m-0 px-2">
        <span>
          <FaUser color={player.color} /> {player.name} ({player.points})
        </span>
        <span>
          <IoTicket /> {player.tickets.length}
        </span>
      </div>
      <div className="row justify-content-end m-0 px-2">
        <span>
          <BiTrain />
          {player.remainingCars}
        </span>
      </div>
      <div className="row justify-content-between m-0 px-2">
        <span>
          <GiPokerHand /> {cardSum}
        </span>
        <span>
          <FaClock /> {player.round}
        </span>
      </div>
    </div>
  );
}

export default PlayerIndicator;
