import React from 'react';
import { WeatherIcon } from './weathericon';
import type { Airport } from '../data/airports';
import type { Route } from '../data/routes';
import WorldMapImage from '../components/wrldmap.jpg'; // Update the path based on your directory structure

interface NetworkMapProps {
  airports: Airport[];
  routes: Route[];
  selectedRoute: { path: string[]; cost: number } | null;
  planePosition: number;
  onWeatherChange: (from: string, to: string, weather: Route['weather']) => void;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({
  airports,
  routes,
  selectedRoute,
  planePosition,
  onWeatherChange,
}) => {
  const renderPlane = () => {
    if (!selectedRoute) return null;
    const currentSegment = Math.floor(planePosition);
    const nextSegment = Math.ceil(planePosition);
    const progress = planePosition - currentSegment;

    const fromAirport = airports.find(
      (airport) => airport.id === selectedRoute.path[currentSegment]
    );
    const toAirport = airports.find(
      (airport) => airport.id === selectedRoute.path[nextSegment]
    );

    if (!fromAirport || !toAirport) return null;

    const x = fromAirport.x + (toAirport.x - fromAirport.x) * progress;
    const y = fromAirport.y + (toAirport.y - fromAirport.y) * progress;

    return (
      <g>
        <text x={x} y={y - 12} textAnchor="middle" fontSize="20" fill="blue">✈️</text>
      </g>
    );
  };

  return (
    <svg className="w-full h-96" viewBox="0 0 500 300">
      {/* World Map Background */}
      <image
        href={WorldMapImage}
        x="0"
        y="0"
        width="500"
        height="300"
        preserveAspectRatio="xMidYMid slice"
      />

      {routes.map((edge, index) => {
        const fromAirport = airports.find((airport) => airport.id === edge.from);
        const toAirport = airports.find((airport) => airport.id === edge.to);
        const isOnSelectedRoute = selectedRoute?.path.includes(edge.from) &&
                                  selectedRoute?.path.includes(edge.to);

        if (!fromAirport || !toAirport) return null;

        return (
          <g key={`edge-${index}`}>
            <line
              x1={fromAirport.x}
              y1={fromAirport.y}
              x2={toAirport.x}
              y2={toAirport.y}
              stroke={isOnSelectedRoute ? 'red' : '#d1d5db'}
              strokeWidth={isOnSelectedRoute ? "3" : "1"}
              strokeDasharray={edge.weather === 'storm' ? "5,5" : "none"}
            />
            <foreignObject
              x={(fromAirport.x + toAirport.x) / 2 - 20}
              y={(fromAirport.y + toAirport.y) / 2 - 25} // Shift weather selector above the line
              width="40"
              height="40"
            >
              <select
                value={edge.weather}
                onChange={(e) => onWeatherChange(edge.from, edge.to, e.target.value as Route['weather'])}
                className="text-xs p-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="clear">
                  <WeatherIcon weather="clear" />
                </option>
                <option value="rain">
                  <WeatherIcon weather="rain" />
                </option>
                <option value="storm">
                  <WeatherIcon weather="storm" />
                </option>
              </select>
            </foreignObject>
          </g>
        );
      })}

      {airports.map((airport) => (
        <g key={`airport-${airport.id}`} transform={`translate(${airport.x}, ${airport.y})`}>
          <circle r="6" fill="blue" />
          <text y="-12" textAnchor="middle" fontSize="14" fontWeight="bold">{airport.name}</text>
        </g>
      ))}

      {renderPlane()}
    </svg>
  );
};
