import { ClientMessages } from "../../api/socket";
import { wsSendMessage } from "../socket/actions";

export const SET_DECK = "SET_DECK";
export const UPDATE_CARD = "UPDATE_CARD";
export const REMOVE_CARD_FROM_PLAYER = "REMOVE_CARD_FROM_PLAYER";

function removeCardFromPlayer(playerId, color, amount) {
  return {
    type: "REMOVE_CARD_FROM_PLAYER",
    payload: { playerId, color, amount },
  };
}

export function setDeck(deck) {
  return {
    type: "SET_DECK",
    payload: deck,
  };
}
function updateCardInDeck(card) {
  return {
    type: "UPDATE_CARD",
    payload: card,
  };
}
export function removeCard(playerId, color, amount){
  return (dispatch, getState) => {
    dispatch(removeCardFromPlayer(playerId, color, amount));

    dispatch(wsSendMessage(ClientMessages.SYNC_STATE, [getState().game.id, {deck: getState().deck, players: getState().players}, true], function() {} ));
  }
}

export function updateCard(card) {
  return (dispatch, getState) => {
    dispatch(updateCardInDeck(card));
    
    dispatch(wsSendMessage(ClientMessages.SYNC_STATE, [getState().game.id, {deck: getState().deck, players: getState().players}, true], function() {} ));
  };
}
