import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppStates } from "../../domain/app";
import { joinRoom } from "../../state/lobby/actions";
import { currentSocketId } from "../../state/socket/reducer";

function ConnectGamePanel({ setShowNewGamePanel, setAppState }) {
  const idRef = useRef(null);
  const nameRef = useRef(null);

  const dispatch = useDispatch();
  const socketId = currentSocketId();
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="card card-login mx-auto text-center">
      <div className="card-header mx-auto">
        <span className="logo_title mt-5"> Csatlakozás játékhoz</span>
      </div>
      <div className="card-body">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            dispatch(
              joinRoom(socketId, nameRef.current.value, idRef.current.value, (resp) => {
                if (resp.status === "ok") {
                  setAppState(AppStates.WAITING_FOR_PLAYERS);
                } else {
                  setErrorMessage(resp.message);
                  console.log(resp.message);
                }
              })
            );

            idRef.current.value = "";
            nameRef.current.value = "";
          }}
        >
          <label htmlFor="room-id">Szoba azonosító</label>
          <br />
          <input
            type="text"
            name="room-id"
            className="form-control input-orange w-50 mx-auto"
            ref={idRef}
            required
          />
          <br />
          <label htmlFor="player-name">Játékos név</label>
          <br />
          <input
            type="text"
            name="player-name"
            className="form-control input-orange w-50 mx-auto"
            ref={nameRef}
            required
          />
          <br />
          <button type="submit" className="btn button-orange px-5 mx-auto">
            Csatlakozás
          </button>
          <br />
          {errorMessage && <div style={{color: 'red'}}>{errorMessage}</div>}
        </form>
      </div>
      <a
        href="/#"
        className="btn text-light mt-2"
        onClick={() => setShowNewGamePanel(true)}
      >
        Új játék indítása
      </a>
    </div>
  );
}

export default ConnectGamePanel;
