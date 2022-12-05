import React from "react";
import { useSelector } from "react-redux";
import { selectLocalPlayer } from "../../../../state/players/selector";

function HistoryPanel() {
  const currentPlayer = useSelector(selectLocalPlayer);
  const histories = currentPlayer.history;
  const historyComponents = histories.map((history, i) => <div key={i}>{history}</div>);
  return (
    <div className="col mx-0 px-0">
      <div className="mx-auto">History</div>
      <div className="col px-0">{historyComponents}</div>
    </div>
  );
}

export default HistoryPanel;
