import "./App.css";
import { useEffect, useState } from "react";
import Layout from "./views/layout/Layout";
import MainPage from "./views/main/MainPage";
import LobbyPage from "./views/lobby/LobbyPage";
import GamePage from "./views/game/GamePage";
import { AppStates } from "./domain/app";
import { useDispatch } from "react-redux";
import { wsConnect } from "./state/socket/actions";

function renderPage(appState, setAppState) {
  switch (appState) {
    case AppStates.MAIN_PAGE:
      return <MainPage setAppState={setAppState}></MainPage>;
    case AppStates.WAITING_FOR_PLAYERS:
      return <LobbyPage setAppState={setAppState}></LobbyPage>;
    case AppStates.IN_GAME:
      return <GamePage setAppState={setAppState}></GamePage>;
    default:
      return <MainPage setAppState={setAppState}></MainPage>;
  }
}

function App() {
  const [appState, setAppState] = useState(AppStates.MAIN_PAGE);
  const [gameRoom, setGameRoom] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    //  dispatch(wsConnect("http://webprogramozas.inf.elte.hu:3031"));
    dispatch(wsConnect(process.env.REACT_APP_BACKEND_SERVER || "http://localhost:3031"));
  }, [dispatch]);

  return (
    <Layout>{renderPage(appState, setAppState, gameRoom, setGameRoom)}</Layout>
  );
}

export default App;
