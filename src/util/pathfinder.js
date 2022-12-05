import { ticketToRideData } from "../data/ticket-to-ride-data";

export function findPathBetweenCities(startCityId, builtConnections) {
  const citiesPI = new Array(
    Object.values(ticketToRideData.cities).length + 1
  ).fill(0);
  const citiesD = new Array(
    Object.values(ticketToRideData.cities).length + 1
  ).fill(100);

  const checkedEdges = [];
  const queue = [];
  queue.push(startCityId);
  citiesD[startCityId] = 0;

  while (queue.length > 0) {
    const currCity = queue[0];

    for (let connectionId of builtConnections) {
      if (checkedEdges.includes(connectionId)) continue;

      const connection = ticketToRideData.connections[connectionId];

      if (connection.from === currCity || connection.to === currCity) {
        const from = connection.from === currCity;
        const cityId = from ? connection.to : connection.from;
        if (citiesD[cityId] === 100 || citiesD[cityId] < citiesD[currCity]) {
          citiesD[cityId] = citiesD[currCity] + 1;
          citiesPI[cityId] = currCity;
          queue.push(cityId);
        }

        checkedEdges.push(connectionId);
      }
    }
    queue.shift();
  }

  return { pi: citiesPI, d: citiesD };
}

export function hasConnectionBetweenCities(
  startCityId,
  endCityId,
  builtConnections
) {
  const { pi, d } = findPathBetweenCities(startCityId, builtConnections);
  let completed = false;
  if (d[endCityId] !== 100) {
    let city = endCityId;
    while (city !== 0 && city !== startCityId) {
      city = pi[city];
    }
    if (city === startCityId) {
      completed = true;
    }
  }

  return completed;
}
