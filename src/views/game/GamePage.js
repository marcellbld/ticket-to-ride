import React, { useEffect } from "react";
import { useState, useRef } from "react";
import Map from "./map/Map";
import { ticketToRideData } from "../../data/ticket-to-ride-data";
import PlayerIndicatorPanel from "./panel/player-indicator/PlayerIndicatorPanel";
import PublicCardsPanel from "./panel/public-cards/PublicCardsPanel";
import DeckPanel from "./panel/deck-panel/DeckPanel";
import TicketDeckPanel from "./panel/ticket-deck-panel/TicketDeckPanel";
import CurrentPlayerCardsPanel from "./panel/current-player-cards-panel/CurrentPlayerCardsPanel";
import HistoryPanel from "./panel/history-panel/HistoryPanel";
import CurrentPlayerTicketPanel from "./panel/current-player-ticket-panel/CurrentPlayerTicketPanel";
import BuildModal from "./BuildModal";
import EndGameModal from "./EndGameModal";
import { useDispatch, useSelector } from "react-redux";
import { selectGame } from "../../state/game/selector";
import { Colors } from "../../domain/colors";
import {
  selectAllBuiltConnections,
  selectCurrentPlayer,
  selectLocalPlayer,
} from "../../state/players/selector";
import {
  nextGameTurn,
  setEndTurn,
  setGameState,
} from "../../state/game/actions";
import { setDeck } from "../../state/deck/actions";
import { selectLocalPlayerCards } from "../../state/deck/selector";
import NotificationModal from "./NotificationModal";
import { GameStates } from "../../domain/game";
import { wsSubscribeChannel } from "../../state/socket/actions";
import { GameActionTypes, ServerMessages } from "../../api/socket";
import {
  addBuiltConnection,
  addCompletedTicket,
  addHistory,
  addTicket,
} from "../../state/players/actions";

function useNotificationModalShow() {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const changeShowNotificationModal = (message) => {
    if (showNotificationModal) return;

    setTimeout(() => {
      setShowNotificationModal(false);
    }, 1000);
    setNotificationMessage(message);
    setShowNotificationModal(true);
  };
  return {
    showNotificationModal,
    notificationMessage,
    changeShowNotificationModal,
  };
}

function useBuildModalShow() {
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [buildableConnection, setBuildableConnection] = useState(-1);

  const changeShowBuildModal = (show, connectionId) => {
    setBuildableConnection(connectionId);
    setShowBuildModal(show);
  };

  return { showBuildModal, buildableConnection, changeShowBuildModal };
}

function useCurrentTicketShow(localPlayerTickets) {
  const [currentTicketShow, setCurrentTicketShow] = useState(0);
  const id = useRef(0);

  const changeCurrentTicketShow = (changeValue) => {
    id.current += changeValue;

    if (id.current < 0) {
      id.current = localPlayerTickets.length - 1;
    } else if (id.current > localPlayerTickets.length - 1) {
      id.current = 0;
    }

    setCurrentTicketShow(id.current);
  };

  return {
    currentTicketShow,
    changeCurrentTicketShow,
  };
}

function GamePage({ setAppState }) {
  const game = useSelector(selectGame);

  const currentPlayer = useSelector(selectCurrentPlayer);
  const localPlayer = useSelector(selectLocalPlayer);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      wsSubscribeChannel(ServerMessages.ACTION_SENT, (resp) => {
        const payload = resp.action.payload;
        switch (resp.action.type) {
          case GameActionTypes.NEXT_TURN:
            dispatch(nextGameTurn());
            break;
          case GameActionTypes.ADD_BUILT_CONNECTION:
            dispatch(
              addBuiltConnection(payload.playerId, payload.connectionId)
            );
            break;
          case GameActionTypes.ADD_TICKET:
            dispatch(addTicket(payload.playerId, payload.ticket));
            break;
          case GameActionTypes.ADD_HISTORY:
            dispatch(addHistory(payload.playerId, payload.historyElement));
            break;
          case GameActionTypes.ADD_COMPLETED_TICKET:
            dispatch(addCompletedTicket(payload.playerId, payload.ticket));
            break;
          case GameActionTypes.END_TURN:
            dispatch(setEndTurn(payload));
            break;
          default:
            break;
        }
      })
    );
    dispatch(
      wsSubscribeChannel(ServerMessages.STATE_CHANGED, (resp) => {
        const state = resp.state;
        if (state.deck) {
          dispatch(setDeck(state.deck));
        }
      })
    );
  }, [dispatch]);

  const localPlayerTickets = localPlayer.tickets;
  const allBuiltConnections = useSelector(selectAllBuiltConnections);
  const localPlayerCards = useSelector(selectLocalPlayerCards);

  const [showTicketCities, setShowTicketCities] = useState(null);
  const { currentTicketShow, changeCurrentTicketShow } = useCurrentTicketShow(
    localPlayerTickets
  );

  const {
    showBuildModal,
    buildableConnection,
    changeShowBuildModal,
  } = useBuildModalShow();
  const {
    showNotificationModal,
    notificationMessage,
    changeShowNotificationModal,
  } = useNotificationModalShow();

  const [chosenCity, setChosenCity] = useState(null);

  return (
    <>
      <div className="h-100 w-100 d-flex flex-column">
        <div className="flex-grow-1 d-flex flex-row mt-2">
          <div className="side-bar text-center d-flex flex-column">
            <PlayerIndicatorPanel />
          </div>
          <div className="flex-grow-1 text-center px-2 d-flex align-items-center">
            <Map
              chosenCity={chosenCity}
              setChosenCity={(city) => {
                if (
                  localPlayer !== currentPlayer ||
                  (game.gameState !== GameStates.USER_BEGIN &&
                    game.gameState !== GameStates.BUILD_LINE)
                ) {
                  changeShowNotificationModal("Most nem tudsz építeni.");
                  return;
                }
                if (city === chosenCity) {
                  setChosenCity(null);
                  dispatch(setGameState(GameStates.USER_BEGIN));
                } else if (chosenCity) {
                  const occupiedConnections = allBuiltConnections.flatMap(
                    ({ _, connections }) => connections
                  );

                  const connection = Object.values(
                    ticketToRideData.connections
                  ).find(
                    (connection) =>
                      (connection.fromCity === city &&
                        connection.toCity === chosenCity) ||
                      (connection.fromCity === chosenCity &&
                        connection.toCity === city)
                  );
                  if (connection.elements.length > localPlayer.remainingCars) {
                    changeShowNotificationModal("Nincs elég vagonod.");
                    return;
                  }
                  let hasEnoughCards =
                    connection &&
                    localPlayerCards.some(
                      ({ color, amount }) =>
                        (connection.color === "gray" ||
                          color === Colors[connection.color.toUpperCase()] ||
                          color === Colors.LOCOMOTIVE) &&
                        amount >= connection.elements.length
                    );
                  if (!hasEnoughCards) {
                    const locomotives = localPlayerCards.find(
                      (card) => card.color === Colors.LOCOMOTIVE
                    ).amount;

                    if (connection.color === "gray") {
                      hasEnoughCards = localPlayerCards.some(
                        ({ _, amount }) =>
                          locomotives + amount >= connection.elements.length
                      );
                    } else {
                      const colorTrains = localPlayerCards.find(
                        (card) =>
                          card.color === Colors[connection.color.toUpperCase()]
                      ).amount;

                      hasEnoughCards =
                        colorTrains + locomotives >= connection.elements.length;
                    }
                  }

                  if (
                    connection &&
                    !occupiedConnections.includes(connection.id) &&
                    hasEnoughCards
                  ) {
                    changeShowBuildModal(true, connection.id);
                  } else {
                    dispatch(setGameState(GameStates.USER_BEGIN));
                    changeShowNotificationModal(
                      "Ezt a vonalat nem tudod megépíteni."
                    );
                  }
                  setChosenCity(null);
                } else {
                  setChosenCity(city);
                  dispatch(setGameState(GameStates.BUILD_LINE));
                }
              }}
              showTicketCities={showTicketCities}
            ></Map>
          </div>
          <div className="side-bar text-center d-flex flex-column align-items-center">
            <div>
              <PublicCardsPanel
                changeShowNotificationModal={changeShowNotificationModal}
              />
            </div>
            <div>
              <DeckPanel></DeckPanel>
            </div>
            <div className="mt-auto mb-4">
              <TicketDeckPanel
                setShowTicketCities={setShowTicketCities}
                changeShowNotificationModal={changeShowNotificationModal}
              ></TicketDeckPanel>
            </div>
          </div>
        </div>
        <div className="bottom-bar d-flex flex-row">
          <div className="side-bar text-center d-flex flex-column">
            <CurrentPlayerTicketPanel
              currentTicketShow={currentTicketShow}
              changeCurrentTicketShow={changeCurrentTicketShow}
              setShowTicketCities={setShowTicketCities}
            ></CurrentPlayerTicketPanel>
          </div>
          <div className="flex-grow-1 text-center px-2 col">
            <CurrentPlayerCardsPanel />
          </div>
          <div className="side-bar text-center d-flex flex-column">
            <HistoryPanel />
          </div>
        </div>
      </div>
      {showNotificationModal && (
        <NotificationModal message={notificationMessage} />
      )}
      {showBuildModal && (
        <BuildModal
          buildableConnection={buildableConnection}
          closeModal={() => {
            changeShowBuildModal(false, -1);
          }}
        ></BuildModal>
      )}
      {game.gameState === GameStates.END_GAME && (
        <EndGameModal
          setAppState={setAppState}
          showTicketCities={showTicketCities}
          setShowTicketCities={setShowTicketCities}
        ></EndGameModal>
      )}
    </>
  );
}
GamePage.propTypes = {};

export default GamePage;
