// @flow

export const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const coinFlip = (): boolean => !!randomInRange(0, 2);
