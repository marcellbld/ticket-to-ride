import PropTypes from "prop-types";

export const TicketCardData = PropTypes.shape({
  id: PropTypes.number.isRequired,
  long: PropTypes.bool.isRequired
});
