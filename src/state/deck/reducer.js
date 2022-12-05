import { CardStates } from "../../domain/card";
import { Colors } from "../../domain/colors";
import { REMOVE_CARD_FROM_PLAYER, SET_DECK, UPDATE_CARD } from "./actions";

const initialState = [];
export function deckReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_DECK:
      return payload;
    case UPDATE_CARD:
      return updateCard(state, payload);
    case REMOVE_CARD_FROM_PLAYER:
      const { playerId, color, amount } = payload;
      return removeCardFromPlayer(state, playerId, color, amount);
    default:
      return state;
  }
}

function refreshPublicCards(deck) {
  let newDeck = [...deck];
  let publicCards = newDeck.filter((card) =>
    CardStates.PUBLIC.includes(card.cardState)
  );

  for (let i = 0; i < CardStates.PUBLIC.length; i++) {
    if (!publicCards.some((card) => card.cardState === CardStates.PUBLIC[i])) {
      for (let card of newDeck) {
        if (card.cardState === CardStates.DECK) {
          card.cardState = CardStates.PUBLIC[i];
          publicCards.push(card);
          break;
        }
      }
    }
  }

  if (
    publicCards.filter((card) => card.color === Colors.LOCOMOTIVE).length >= 3
  ) {
    newDeck = newDeck.map((card) => {
      if (CardStates.PUBLIC.includes(card.cardState))
        return {...card, cardState: CardStates.REMOVED};

      return card;
    });
    return refreshPublicCards(newDeck);
  }

  return newDeck;
}

function updateCard(deck, updatedCard) {
  let isPublicCard = false;
  let updatedDeck = deck.map((card) => {
    if (card.id === updatedCard.id) {
      if (card.cardState <= CardStates.PUBLIC[0]) {
        isPublicCard = true;
      }
      return updatedCard;
    } else {
      return card;
    }
  });
  if (isPublicCard) {
    updatedDeck = refreshPublicCards(updatedDeck);
  }

  return updatedDeck;
}

function removeCardFromPlayer(deck, playerId, color, amount) {
  let updatedCards = 0;
  let updatedDeck = deck.map((card) => {
    if (
      updatedCards < amount &&
      card.cardState === playerId &&
      card.color === color
    ) {
      updatedCards++;
      return { ...card, cardState: CardStates.REMOVED };
    }
    return card;
  });
  return updatedDeck;
}