import classNames from "classnames";
import { motion } from "framer-motion";
import React from "react";

function ConnectionMarker({ color, connection, ticketShow }) {
  const markers = connection.elements.map((coordinate, i) => (
    <motion.span
      key={i}
      className={classNames("position-absolute", "dot")}
      style={{
        left: "calc(" + coordinate.x + "% - 0.6rem)",
        top: "calc(" + coordinate.y + "% - 0.6rem)",
        backgroundColor: color,
        scale: 2.0,
        borderStyle: "solid",
        borderColor: "#008FFF",
        borderWidth: "0rem"
      }}
      whileHover={{ scale: 1.3 }}
      animate={{
        transition: { duration: (ticketShow ? 0.15 : 0.5) },
        scale: 1.0,
        borderWidth: ticketShow ? "0.2rem" : "0rem",
      }}
    ></motion.span>
  ));

  return <>{markers}</>;
}

export default ConnectionMarker;
