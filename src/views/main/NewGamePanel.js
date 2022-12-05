import React from "react";
import { AppStates } from "../../domain/app";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { createRoom } from "../../state/lobby/actions";
import { currentSocketId } from "../../state/socket/reducer";

function NewGamePanel({ setShowNewGamePanel, setAppState }) {
  const numberOfPlayersRef = useRef(null);
  const nameRef = useRef(null);

  const dispatch = useDispatch();

  return (
    <div className="card card-login mx-auto text-center">
      <div className="card-header mx-auto">
        <span className="logo_title mt-5"> Új játék indítása</span>
      </div>
      <div className="card-body">
        <form
          onSubmit={(e) => {
            const socketId = currentSocketId();
            e.preventDefault();
            dispatch(createRoom(socketId, nameRef.current.value, numberOfPlayersRef.current.value, (resp) => {

              numberOfPlayersRef.current.value = "1";
              nameRef.current.value = "";
              setAppState(AppStates.WAITING_FOR_PLAYERS);

            }));
            
          }}
        >
          <label htmlFor="player-number">Játékosok száma</label>
          <br />
          <select
            className="form-control mx-auto custom-select"
            name="player-number"
            defaultValue="1"
            style={{ width: "auto" }}
            ref={numberOfPlayersRef}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <br />
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
            Indítás
          </button>
        </form>
      </div>
      <a
        href="/#"
        className="btn text-light mt-2"
        onClick={() => setShowNewGamePanel(false)}
      >
        Csatlakozás meglévő játékhoz
      </a>
    </div>
  );
}

export default NewGamePanel;
