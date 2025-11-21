import React, { useState, useEffect } from 'react';
import { NetworkMap } from './components/networkmap';
import { WeatherIcon } from './components/weathericon';
import { airports } from './data/airports';
import { initialRoutes } from './data/routes';
import { conditionFactors } from './constants/conditions';
import type { Route } from './data/routes';

function SmartAirliftRouter() {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [routingPriority, setRoutingPriority] = useState('balanced');
  const [availableRoutes, setAvailableRoutes] = useState<Array<{ path: string[]; cost: number }>>([]);
  const [selectedRoute, setSelectedRoute] = useState<{ path: string[]; cost: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [planePosition, setPlanePosition] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [stormTriggered, setStormTriggered] = useState(false); // State to track storm impact
  const [currentState, setCurrentState] = useState<string>(''); // To track the current state

  useEffect(() => {
    if (selectedRoute) {
      setPlanePosition(0);
      setIsSimulating(true);
    } else {
      setIsSimulating(false);
    }
  }, [selectedRoute]);

  useEffect(() => {
    if (selectedRoute && isSimulating) {
      const interval = setInterval(() => {
        setPlanePosition((prev) => {
          if (prev >= selectedRoute.path.length - 1) {
            clearInterval(interval);
            setIsSimulating(false);
            return selectedRoute.path.length - 1;
          }
          return prev + 0.02; // Adjust the speed of the simulation by changing the increment value (0.02)
        });
      }, 50); // Update every 50ms to simulate movement
      return () => clearInterval(interval);
    }
  }, [selectedRoute, isSimulating]);

  useEffect(() => {
    if (selectedRoute) {
      // Calculate which state the plane is currently in based on the position in the route path
      const stateIndex = Math.floor(planePosition);
      if (stateIndex < selectedRoute.path.length) {
        setCurrentState(selectedRoute.path[stateIndex]); // Assuming the state or city is in the path
      }
    }
  }, [planePosition, selectedRoute]);

  const calculateRouteCost = (path: string[], priority: string) => {
    let totalCost = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const edge = routes.find(e =>
        (e.from === path[i] && e.to === path[i + 1]) ||
        (e.to === path[i] && e.from === path[i + 1])
      );
      if (edge) {
        const weatherFactor = conditionFactors.weather[edge.weather];
        const altitudeFactor = conditionFactors.altitude[edge.altitude];
        switch (priority) {
          case 'distance':
            totalCost += edge.distance;
            break;
          case 'fuel':
            totalCost += edge.fuelCost;
            break;
          case 'weather':
            totalCost += weatherFactor;
            break;
          default:
            totalCost += (edge.distance + edge.fuelCost) / 2;
        }
      }
    }
    return totalCost;
  };

  const findRoutes = (start: string, end: string, priority: string) => {
    const paths: Array<{ path: string[]; cost: number }> = [];
    const visited = new Set<string>();

    const aStar = (current: string, path: string[], cost: number) => {
      if (current === end) {
        paths.push({ path: [...path], cost });
        return;
      }

      visited.add(current);

      const edges = routes.filter(route =>
        (route.from === current && !visited.has(route.to)) ||
        (route.to === current && !visited.has(route.from))
      );

      for (const edge of edges) {
        const next = edge.from === current ? edge.to : edge.from;
        if (!visited.has(next) && edge.weather !== 'storm') {
          
          const newCost = cost + calculateRouteCost([current, next], priority);
          path.push(next);
          aStar(next, path, newCost);
          path.pop();
        }
      }

      visited.delete(current);
    };

    aStar(start, [start], 0);

    if (paths.length === 0) {
      setError("No storm-free route available between these airports.");
      return [];
    }

    setError(null);
    return paths.sort((a, b) => a.cost - b.cost).slice(0, 3);
  };

  const handleRouteSearch = () => {
    const results = findRoutes(source, destination, routingPriority);
    setAvailableRoutes(results);
    setSelectedRoute(results.length > 0 ? results[0] : null);
  };

  const handleWeatherChange = (from: string, to: string, weather: Route['weather']) => {
    // Update the weather for the specific route segment
    const updatedRoutes = routes.map((route) => {
      if ((route.from === from && route.to === to) || (route.from === to && route.to === from)) {
        return { ...route, weather };
      }
      return route;
    });
    setRoutes(updatedRoutes); // Set updated routes with the new weather

    // Set stormTriggered state to true to recalculate the path
    if (weather === 'storm') {
      setStormTriggered(true);
    }
  };

  useEffect(() => {
    if (stormTriggered) {
      const currentAirport = selectedRoute ? selectedRoute.path[Math.floor(planePosition)] : source;
      const newRoutes = findRoutes(currentAirport, destination, routingPriority);
      if (newRoutes.length > 0) {
        setAvailableRoutes(newRoutes);
        setSelectedRoute(newRoutes[0]);
        setPlanePosition(0); // Reset position to start from the new segment
        setIsSimulating(true); // Restart simulation
        setStormTriggered(false); // Reset stormTriggered after recalculation
        setError(null);
      } else {
        setAvailableRoutes([]);
        setSelectedRoute(null);
        setIsSimulating(false); // Stop simulation if no routes available
        setStormTriggered(false);
        setError("No storm-free route available between these airports.");
      }
    }
  }, [stormTriggered, selectedRoute, planePosition, source, destination, routingPriority]);

  // Handle route selection from available routes
  const handleAvailableRouteSelect = (route: { path: string[]; cost: number }) => {
    setSelectedRoute(route);
    setPlanePosition(0); // Reset plane position when a new route is selected
    setIsSimulating(true); // Start simulating the selected route
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800">
          <h1 className="text-3xl font-bold text-white text-center">Smart Airlift Router</h1>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div>
              <label className="block font-semibold mb-1 text-gray-600">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400"
              >
                <option value="">Select Source</option>
                {airports.map((airport) => (
                  <option key={airport.id} value={airport.id}>{airport.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-600">Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400"
              >
                <option value="">Select Destination</option>
                {airports.map((airport) => (
                  <option key={airport.id} value={airport.id}>{airport.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-600">Priority</label>
              <select
                value={routingPriority}
                onChange={(e) => setRoutingPriority(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400"
              >
                <option value="balanced">Balanced</option>
                <option value="distance">Shortest Distance</option>
                <option value="fuel">Fuel Efficient</option>
                <option value="weather">Weather Optimal</option>
              </select>
            </div>

            <button
              onClick={handleRouteSearch}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md transition-all duration-200"
            >
              Find Routes
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="border rounded p-4 mb-8 bg-gray-50">
            <NetworkMap
              airports={airports}
              routes={routes}
              selectedRoute={selectedRoute}
              planePosition={planePosition}
              onWeatherChange={handleWeatherChange}
            />
          </div>

          <div className="bg-white p-4 rounded shadow">
            {availableRoutes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Available Routes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-100 p-4 transition-all cursor-pointer"
                      onClick={() => handleAvailableRouteSelect(route)} // Add onClick for route selection
                    >
                      <div className="text-lg font-semibold text-blue-600">
                        {route.path.join(' -> ')}
                      </div>
                      <div className="text-gray-500 text-sm mt-2">Cost: {route.cost.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRoute && (
              <div className="mt-6">
                <div className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded shadow">
                  <h2 className="text-xl font-semibold">Selected Route</h2>
                  <p className="text-gray-700">
                    <strong>Path:</strong> {selectedRoute.path.join(' -> ')}
                  </p>
                  <p className="text-gray-700">
                    <strong>Cost:</strong> {selectedRoute.cost.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Simulation */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Current State</h3>
        <p className="text-gray-700">
          {selectedRoute ? (
            `The plane is currently traveling through: ${currentState}`
          ) : (
            'No route selected.'
          )}
        </p>
      </div>

      {/* Explanation of Weather Icons */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Weather Icons Explanation</h3>
        <ul className="list-disc pl-5">
          <li>
            <WeatherIcon weather="clear" /> Clear: No adverse weather conditions.
          </li>
          <li>
            <WeatherIcon weather="rain" /> Rain: Moderate rain conditions.
          </li>
          <li>
            <WeatherIcon weather="storm" /> Storm: Severe weather with potential flight hazards.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SmartAirliftRouter;
