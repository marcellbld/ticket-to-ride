import React from "react";
import { useState } from "react";
import ConnectGamePanel from "./ConnectGamePanel";
import NewGamePanel from "./NewGamePanel";

function MainPage({ setAppState }) {
  const [showNewGamePanel, setShowNewGamePanel] = useState(true);
  
  return (
    <div className="h-100 d-flex flex-column align-items-center">
      <div className="mt-4 position-absolute">
        <img src="logo.png" alt="" />
      </div>
      <div className="my-auto">
        {showNewGamePanel ? (
          <NewGamePanel
            setShowNewGamePanel={setShowNewGamePanel}
            setAppState={setAppState}
          ></NewGamePanel>
        ) : (
          <ConnectGamePanel
            setShowNewGamePanel={setShowNewGamePanel}
            setAppState={setAppState}
          ></ConnectGamePanel>
        )}
      </div>
      <div className="mb-2 text-center">
        <a
          className="btn text-light"
          href="https://tarsasjatekrendeles.hu/shop_ordered/7237/pic/Compaya/Ticket_To_Ride_Europe.pdf"
        >
          Játékszabályzat
        </a>
      </div>
    </div>
  );
}

export default MainPage;
