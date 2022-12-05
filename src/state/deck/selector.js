import { CardStates } from "../../domain/card";
import { Colors } from "../../domain/colors";
import { selectLocalPlayer, selectPlayers } from "../players/selector";

export function selectDeck(state) {
  return state.deck;
}

export function selectFreeCards(state) {
  return selectDeck(state).filter((card) => card.cardState === CardStates.DECK);
}

export function selectAllPlayerCards(state) {
  const deck = selectDeck(state).filter((card) => card.cardState >= CardStates.PLAYERS[0]);
  const players = selectPlayers(state);

  const output = [];
  for(let player of players) {
    output.push({playerId: player.id, cards: getPlayerCards(deck, player.id)});
  }
  return output;
}

export function selectLocalPlayerCards(state) {
  const player = selectLocalPlayer(state);

  return getPlayerCards(selectDeck(state), player.id);
}

export function selectPublicCards(state) {
  return selectDeck(state).filter((card) => CardStates.PUBLIC.includes(card.cardState));
}

export function selectTopCardOfDeck(state) {
  const deck = selectDeck(state).filter((card) => card.cardState === CardStates.DECK);
  return deck[0];
}

function getPlayerCards(deck, cardState) {
  const cards = deck.filter(
    (card) => card.cardState === cardState
  );

  const outputCards = [];
  for (let color of Object.values(Colors)) {
    const amount = cards.filter((c) => c.color === color).length;
      outputCards.push({ color, amount });
  }

  return outputCards;
}
