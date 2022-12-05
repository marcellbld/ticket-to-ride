import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { deckReducer } from "./deck/reducer";
import { gameReducer } from "./game/reducer";
import { lobbyReducer } from "./lobby/reducer";
import { playersReducer } from "./players/reducer";
import { socketMiddleware } from "./socket/reducer";

export const store = createStore(
    combineReducers({
        players: playersReducer,
        game: gameReducer,
        deck: deckReducer,
        lobby: lobbyReducer
    }),
    composeWithDevTools(
      applyMiddleware(thunk, socketMiddleware)
    ),
);