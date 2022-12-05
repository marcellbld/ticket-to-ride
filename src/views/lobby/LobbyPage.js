import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClientMessages, ServerMessages } from "../../api/socket";
import { AppStates } from "../../domain/app";
import { CardStates } from "../../domain/card";
import { Colors } from "../../domain/colors";
import { GameStates } from "../../domain/game";
import { setDeck } from "../../state/deck/actions";
import { setGame } from "../../state/game/actions";
import { setRoom } from "../../state/lobby/actions";
import { selectLobbyRoom } from "../../state/lobby/selector";
import { setPlayers } from "../../state/players/actions";
import {
  wsSendMessage,
  wsSubscribeChannel,
  wsUnsubscribeChannel,
} from "../../state/socket/actions";
import { currentSocketId } from "../../state/socket/reducer";
import { shuffle } from "../../util/shuffle";

function useRoomIsFull(initialValue, setAppState) {
  const [roomIsFull, setRoomIsFull] = useState(initialValue);
  const [startTimer, setStartTimer] = useState(1.0);

  useEffect(() => {
    const timer =
      roomIsFull &&
      setInterval(() => {
        setStartTimer(startTimer - 1);
        if (startTimer <= 0) {
          clearInterval(timer);
          setAppState(AppStates.IN_GAME);
        }
      }, 1000);
    return () => clearInterval(timer);
  }, [startTimer, roomIsFull, setAppState]);

  const changeRoomIsFull = (newValue) => {
    setRoomIsFull(newValue);
  };

  return {
    startTimer,
    roomIsFull,
    changeRoomIsFull,
  };
}
function startGame(dispatch, lobbyRoom) {
  const game = {
    id: lobbyRoom.roomId,
    currentPlayerId: 0,
    playerNumber: lobbyRoom.players.length,
    publicCards: [],
    gameState: GameStates.USER_BEGIN,
    endTurn: -1,
  };
  const players = lobbyRoom.players.map((player, i) => {
    const playerTickets = [];
    playerTickets.push({
      id: Math.floor(Math.random() * 6),
      long: true,
    });
    while (playerTickets.length < 6) {
      let randomId = Math.floor(Math.random() * 40);
      if (
        !playerTickets.find(
          (ticket) => ticket.id === randomId && ticket.long === false
        )
      ) {
        playerTickets.push({ id: randomId, long: false });
      }
    }
    return {
      id: i,
      name: player.name,
      socketId: player.id,
      points: 0,
      remainingCars: 45,
      cards: [],
      tickets: playerTickets,
      completedTickets: [],
      round: 0,
      color: Object.values(Colors)[i],
      builtConnections: [],
      history: [],
    };
  });
  players[0].round = 1;
  const colorNumber = Object.keys(Colors).length - 1;
  let cardId = 0;
  const randomDeck = [...Array(colorNumber * 12).keys()].map((i) => {
    return {
      id: cardId++,
      color: Object.values(Colors)[i % colorNumber],
      cardState: CardStates.DECK,
    };
  });
  randomDeck.push(
    ...[...Array(14).keys()].map((_) => {
      return {
        id: cardId++,
        color: Colors.LOCOMOTIVE,
        cardState: CardStates.DECK,
      };
    })
  );
  shuffle(randomDeck);

  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < 5; j++) {
      randomDeck[i * 5 + j].cardState = i;
    }
  }
  for (let i = 0; i < 5; i++) {
    randomDeck[players.length * 5 + i].cardState = CardStates.PUBLIC[i];
  }

  dispatch(
    wsSendMessage(
      ClientMessages.SYNC_STATE,
      [game.id, { game: game, deck: randomDeck, players: players }, false],
      function () {}
    )
  );
}

function LobbyPage({ setAppState }) {
  const lobbyRoom = useSelector(selectLobbyRoom);
  const { startTimer, roomIsFull, changeRoomIsFull } = useRoomIsFull(
    false,
    setAppState
  );
  const dispatch = useDispatch();
  const socketId = currentSocketId();

  useEffect(() => {
    console.log("USE EFFECT");
    dispatch(
      wsSubscribeChannel(ServerMessages.STATE_CHANGED, function (data) {
        if (data.state.game) {
          dispatch(setGame(data.state.game));
          dispatch(setDeck(data.state.deck));
          dispatch(setPlayers(data.state.players));

          dispatch(wsUnsubscribeChannel(ServerMessages.STATE_CHANGED));
        } else {
          const room = data.state;
          dispatch(setRoom(room.roomId, room.roomSize, room.players));
        }
      })
    );
  }, [dispatch]);

  if (!roomIsFull) {
    const full = lobbyRoom.players.length === +lobbyRoom.roomSize;

    if (full) {
      changeRoomIsFull(full);
      if (lobbyRoom.players[0] && lobbyRoom.players[0].id === socketId) {
        startGame(dispatch, lobbyRoom);
      }
    }
  }

  const playerElements = lobbyRoom.players.map(({ _, name }, i) => (
    <div key={i + 1} className="text-center">
      {name}
    </div>
  ));
  playerElements.unshift(<div key={0} className="text-orange">Players</div>);

  return (
    <div className="h-100 d-flex flex-column align-items-center">
      <div className="mt-5 position-absolute col">
        <div className="text-center">Szoba azonosító:</div>
        <div className="h2 text-orange text-center">{lobbyRoom.roomId}</div>
      </div>
      <div className="position-absolute" style={{ top: "40%" }}>
        <div className="position-relative text-center">
          {roomIsFull ? (
            <>
              <div>Kezdődik a játék</div>
              <div>{startTimer}</div>
            </>
          ) : (
            <>
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div>
                <span>Waiting for players...</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-auto text-center">
        <div>{playerElements}</div>
        <div className="mb-2">
          {!roomIsFull && (
            <button
              type="button"
              className="btn button-orange px-5 mx-auto"
              onClick={() => {
                dispatch(
                  wsSendMessage(
                    ClientMessages.SYNC_STATE,
                    [
                      lobbyRoom.roomId,
                      {
                        ...lobbyRoom,
                        players: lobbyRoom.players.filter(
                          (p) => p.id !== socketId
                        ),
                      },
                      false,
                    ],
                    function () {
                      setAppState(AppStates.MAIN_PAGE);
                    }
                  )
                );
              }}
            >
              Vissza
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
LobbyPage.propTypes = {};

export default LobbyPage;
