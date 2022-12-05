import React from "react";
import { useSelector } from "react-redux";
import { selectLocalPlayerCards } from "../../../../state/deck/selector";
import CurrentPlayerCard from "../../CurrentPlayerCard";

function CurrentPlayerCardsPanel() {
  const cards = useSelector(selectLocalPlayerCards);
  const currentPlayerCards = cards.filter((card) => card.amount > 0).map((card, i) => (
    <CurrentPlayerCard key={i} color={card.color} amount={card.amount}></CurrentPlayerCard>
  ));
  return (
    <>
      <div>Aktuális játékos kártyái</div>
      <div className="row justify-content-center">{currentPlayerCards}</div>
    </>
  );
}

export default CurrentPlayerCardsPanel;
