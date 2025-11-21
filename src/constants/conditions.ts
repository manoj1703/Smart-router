export const conditionFactors = {
    weather: {
      clear: 1,
      rain: 100,
      storm: 999999
    },
    altitude: {
      low: 1,
      medium: 1.2,
      high: 1.4
    }
  } as const;