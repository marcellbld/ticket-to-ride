import PropTypes from "prop-types";
import { Colors } from "./colors";

export const CardData = PropTypes.shape({
  id: PropTypes.number.isRequired,
  color: PropTypes.oneOf(Object.values(Colors)),
  cardState: PropTypes.oneOf(Object.values(Colors)),
});

export const CardStates = {
  PLAYERS: [0, 1, 2, 3, 4],
  DECK: -1,
  PUBLIC: [-2, -3, -4, -5, -6],
  REMOVED: -10,
};
