interface WeatherIconProps {
  weather: 'clear' | 'rain' | 'storm';
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ weather }) => {
  switch (weather) {
    case 'clear':
      return <span className="text-yellow-400 text-xl">☀️</span>; // Sun icon
    case 'rain':
      return <span className="text-blue-400 text-xl">🌧️</span>; // Rain icon
    case 'storm':
      return <span className="text-gray-500 text-xl">⛈️</span>; // Storm icon
    default:
      return null;
  }
};
