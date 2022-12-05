import PropTypes from "prop-types";
import { CardData } from "./card";
import { Colors } from "./colors";
import { TicketCardData } from "./ticker-card";

export const Player = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    remainingCars: PropTypes.number.isRequired,
    cards: PropTypes.arrayOf(CardData).isRequired,
    tickets: PropTypes.arrayOf(TicketCardData).isRequired,
    completedTickets: PropTypes.arrayOf(PropTypes.number).isRequired,
    round: PropTypes.number.isRequired,
    color: PropTypes.oneOf(Object.values(Colors)).isRequired,
    builtConnections: PropTypes.arrayOf(PropTypes.number).isRequired,
    history: PropTypes.arrayOf(PropTypes.string).isRequired
});