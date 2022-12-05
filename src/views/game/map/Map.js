import React from "react";
import { useSelector } from "react-redux";
import { ticketToRideData } from "../../../data/ticket-to-ride-data";
import {
  selectAllBuiltConnections,
  selectLocalPlayer,
} from "../../../state/players/selector";
import { findPathBetweenCities } from "../../../util/pathfinder";
import CityMarker from "./CityMarker";
import ConnectionMarker from "./ConnectionMarker";

function Map({ chosenCity, setChosenCity, showTicketCities }) {
  const ticketData = showTicketCities;
  const localPlayer = useSelector(selectLocalPlayer);
  const neighbours = Object.values(ticketToRideData.connections)
    .filter(
      (connection) =>
        connection.fromCity === chosenCity || connection.toCity === chosenCity
    )
    .map((connection) => {
      return connection.fromCity === chosenCity
        ? connection.toCity
        : connection.fromCity;
    });
  const allBuiltConnections = useSelector(selectAllBuiltConnections);
  const builtConnections = localPlayer.builtConnections;

  const showConnections = [];
  if (ticketData) {
    
    const {pi} = findPathBetweenCities(ticketData.from, builtConnections);
    const completed = localPlayer.completedTickets.find(ticket => (ticket.id+1) === (+ticketData.id));

    if (completed) {
      let city = ticketData.to;
      while (city !== 0 && city !== ticketData.from) {
        for (let connectionId of builtConnections) {
          const connection = ticketToRideData.connections[connectionId];
          if (
            (connection.from === city && connection.to === pi[city]) ||
            (connection.to === city && connection.from === pi[city])
          ) {
            showConnections.push(connectionId);
            break;
          }
        }
        city = pi[city];
      }
    }
  }

  const connectionElements = [];
  allBuiltConnections.forEach(({ color, connections }) => {
    connections.forEach((connectionId) => {
      const connectionData = Object.values(ticketToRideData.connections)[
        connectionId - 1
      ];
      connectionElements.push(
        <ConnectionMarker
          key={connectionData.id}
          color={color}
          connection={connectionData}
          ticketShow={showConnections.includes(connectionId)}
        />
      );
    });
  });

  const cities = Object.values(ticketToRideData.cities).map((city) => (
    <CityMarker
      key={city.id}
      city={city}
      chosenCity={chosenCity}
      setChosenCity={setChosenCity}
      active={chosenCity === city.city}
      neighbour={neighbours.findIndex((value) => city.city === value) !== -1}
      ticketShow={
        ticketData &&
        (ticketData.fromCity === city.city ||
          ticketData.toCity === city.city ||
          showConnections.some(
            (c) =>
              Object.values(ticketToRideData.connections)[c - 1].fromCity ===
                city.city ||
              Object.values(ticketToRideData.connections)[c - 1].toCity ===
                city.city
          ))
      }
    />
  ));
  return (
    <div className="px-auto mx-auto">
      <div className="container position-relative mx-0 px-0">
        <img src="map.png" className="map-img" alt="" />
        {Object.values(cities)}
        {connectionElements}
      </div>
    </div>
  );
}

export default Map;
