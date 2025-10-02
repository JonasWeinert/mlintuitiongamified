
import { DataPoint } from './types';

// Generate semi-random but correlated data for the ice cream shop example.
const generateIceCreamData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const slope = 5;
  const intercept = 50;
  const numPoints = 25;

  for (let i = 0; i < numPoints; i++) {
    const x = 10 + Math.random() * 25; // Temperature between 10°C and 35°C
    const noise = (Math.random() - 0.5) * 60; // Add some noise
    const y = slope * x + intercept + noise;
    if (y > 0) { // Ensure sales are not negative
        data.push({ x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(0)) });
    }
  }
  return data;
};

export const ICE_CREAM_DATA: DataPoint[] = generateIceCreamData();
