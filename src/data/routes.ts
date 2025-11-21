export interface Route {
  from: string;
  to: string;
  distance: number;
  weather: 'clear' | 'rain' | 'storm';
  altitude: 'low' | 'medium' | 'high';
  fuelCost: number;
}

export const initialRoutes: Route[] = [
  { from: 'GRE', to: 'KYR', distance: 350, weather: 'clear', altitude: 'low', fuelCost: 1000 }, // DEL to MUM
  { from: 'KYR', to: 'MSC', distance: 500, weather: 'rain', altitude: 'low', fuelCost: 800 },   // MUM to BLR
  { from: 'GRE', to: 'MSC', distance: 900, weather: 'clear', altitude: 'high', fuelCost: 400 }, // DEL to BLR
  { from: 'GRE', to: 'ALA', distance: 250, weather: 'rain', altitude: 'low', fuelCost: 399 },   // DEL to CHN
  { from: 'ALA', to: 'CHI', distance: 200, weather: 'clear', altitude: 'low', fuelCost: 120 },  // CHN to HYD
  { from: 'MSC', to: 'HYD', distance: 299, weather: 'clear', altitude: 'low', fuelCost: 140 },  // BLR to AMD
  { from: 'KYR', to: 'KEN', distance: 150, weather: 'storm', altitude: 'medium', fuelCost: 100 }, // MUM to GOA
  { from: 'CHI', to: 'BRA', distance: 175, weather: 'rain', altitude: 'low', fuelCost: 187 },   // HYD to CCU
  { from: 'BRA', to: 'CPT', distance: 225, weather: 'clear', altitude: 'medium', fuelCost: 217 }, // CCU to PNQ
  { from: 'CHI', to: 'CPT', distance: 396, weather: 'clear', altitude: 'low', fuelCost: 517 },  // HYD to PNQ
  { from: 'CPT', to: 'AUS', distance: 299, weather: 'storm', altitude: 'high', fuelCost: 600 }, // PNQ to JAI
  { from: 'ALA', to: 'KEN', distance: 1000, weather: 'clear', altitude: 'low', fuelCost: 800 }, // CHN to GOA
  { from: 'KEN', to: 'AUS', distance: 311, weather: 'clear', altitude: 'medium', fuelCost: 670 }, // GOA to JAI
  { from: 'HYD', to: 'KEN', distance: 313, weather: 'clear', altitude: 'low', fuelCost: 689 }   // AMD to GOA
];
