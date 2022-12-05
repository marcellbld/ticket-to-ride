import React, { useState } from "react";
import { motion } from "framer-motion";

function shadeColor(color, percent) {
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  var RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

function useDestroy() {
  const [destroy, setDestroy] = useState(false);

  const setDestroyed = () => {
    if (destroy) return false;

    setDestroy(true);
    setTimeout(() => {
      setDestroy(false);
    }, 500);
    return true;
  };

  return { destroy, setDestroyed };
}

function Card({ cardData, onClick = {}, clickable}) {
  const { destroy, setDestroyed } = useDestroy();

  return (
    <motion.button
      className="game-card card my-2 mx-1 p-0"
      whileHover={{
        transition: { duration: 0.15 },
        scale: clickable ? 1.1 : 1, 
      }}
      whileTap={{ scale: clickable ? 0.9 : 1}}
      variants={{
        destroy: {
          opacity: 0,
          x: "-50%",
          scale: 2,
          transition: { duration: 0.25 },
        },
        simple: {
          opacity: 1,
          x: 0,
          scale: 1,
          transition: { duration: 0.25 },
        },
      }}
      animate={(destroy && "destroy") || "simple"}
      onClick={() => {
          if (onClick()) {
            setDestroyed();
          }
      }}
      style={
        cardData && {
          background:
            "linear-gradient(135deg," +
            cardData.color +
            "," +
            shadeColor(cardData.color, -40) +
            ")",
            x: "-50%",
            opacity: 0
        }
      }
    ></motion.button>
  );
}

export default Card;
