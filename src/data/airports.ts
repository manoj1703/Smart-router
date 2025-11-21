export interface Airport {
  id: string;
  name: string;
  x: number;
  y: number;
}

export const airports: Airport[] = [
  { id: 'GRE', name: 'GRE', x: 170, y: 30 },   // Previously DEL, now Greece
  { id: 'KYR', name: 'KYR', x: 255, y: 100 },  // Previously MUM, now Cairo
  { id: 'MSC', name: 'MSC', x: 400, y: 50 },   // Previously BLR, now Moscow
  { id: 'BRA', name: 'BRA', x: 170, y: 170 },  // Previously CCU, now Brazil
  { id: 'HYD', name: 'HYD', x: 390, y: 120 },  // Previously AMD, now Hyderabad
  { id: 'CPT', name: 'CPT', x: 300, y: 200 },  // Previously PNQ, now Cape Town
  { id: 'ALA', name: 'ALA', x: 60, y: 90 },    // Previously CHN, now Alaska
  { id: 'CHI', name: 'CHI', x: 119, y: 237 },  // Previously HYD, now Chile
  { id: 'KEN', name: 'KEN', x: 300, y: 140 },  // Previously GOA, now Kenya
  { id: 'AUS', name: 'AUS', x: 480, y: 200 }   // Previously JAI, now Australia
];
