// @flow

import { randomInRange, coinFlip } from './helpers';
import { Faces, FaceAxisInfo, createMove } from './common';
import type { Move } from './common';

export type GenerateConfig = {
  cubeSize: number,
  length: number
};

/**
 * Generates a random scramble for the given cube size.
 * @example
 * import { generate } from 'scramble-generator';
 * generate({ cubeSize: 3 });
 * // [ { face: 'U', inverted: false, double: true },
 * // { face: 'R', inverted: true, double: false },
 * // { face: 'D', inverted: false, double: true }, ... ]
 */
export const generate = ({ cubeSize = 3, length = (cubeSize - 2) * 20 || 8 }: GenerateConfig = {}): Move[] => {
  const scramble = [];
  const maxLayers = Math.floor(cubeSize / 2);
  let lastAxis;
  for(let i = 0; i < length; i++) {
    const faceSelections = Object.keys(Faces).filter(face => FaceAxisInfo[face] !== lastAxis);
    const rand = randomInRange(0, faceSelections.length);
    const face = faceSelections[rand];
    lastAxis = FaceAxisInfo[face];
    scramble.push(createMove({
      face,
      inverted: coinFlip(),
      double: coinFlip(),
      layerCount: randomInRange(1, maxLayers + 1)
    }));
  }
  return scramble;
};
