export const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const coinFlip = () => !!randomInRange(0, 2);
