import classNames from "classnames";
import { motion } from "framer-motion";
import React from "react";

function CityMarker({ city, setChosenCity, active, neighbour, ticketShow }) {
  const left = "calc(" + city.x + "% - 0.6rem)";
  const top = "calc(" + city.y + "% - 0.6rem)";

  return (
    <motion.span
      className={classNames("position-absolute", "dot")}
      animate={{
        transition: { duration: 0.15 },
        scale: 1.0,
        backgroundColor: active ? "#ffffff" : "#2e2e2e",
        borderColor: ticketShow ? "#008FFF" : active ? "#2e2e2e" : "#ffffff",
        borderWidth: neighbour || ticketShow ? "0.2rem" : "0rem",
      }}
      whileHover={{ scale: 1.2 }}
      style={{
        left: left,
        top: top,
        borderStyle: "solid",
      }}
      onClick={() => {
        setChosenCity(city.city);
      }}
    ></motion.span>
  );
}

export default CityMarker;
