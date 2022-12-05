import React from "react";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import classNames from "classnames";

function TicketCard({ ticketData, long, completed }) {
  return (
    <div
      className={classNames("card ticket-card", {
        completed: completed,
      })}
    >
      <div className="h-100 d-flex flex-row">
        <div className="my-auto ml-1">
          <IoArrowForwardCircleSharp className="" size={50} />
        </div>
        <div className="my-auto ml-1 text-left">
          <span>{ticketData.fromCity}</span>
          <br />
          <span>{ticketData.toCity}</span>
        </div>
      </div>
      {long && <small>Hosszú cél</small>}
    </div>
  );
}

export default TicketCard;
