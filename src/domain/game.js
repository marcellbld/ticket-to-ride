import PropTypes from "prop-types";
import { CardData } from "./card";

export const GameStates = {
  USER_BEGIN: 0,
  DRAW_CARDS: 1,
  DRAW_CARD2: 2,
  BUILD_LINE: 3,
  SELECT_CARDS: 4,
  NEW_DESTINATIONS: 5,
  END_GAME: 9,
}

export const GameData = PropTypes.shape({
  id: PropTypes.number.isRequired,
  currentPlayerId: PropTypes.number.isRequired,
  playerNumber: PropTypes.number.isRequired,
  publicCards: PropTypes.arrayOf(CardData).isRequired,
  gameState: PropTypes.oneOf(Object.values(GameStates)).isRequired,
  endTurn: PropTypes.number.isRequired
});
