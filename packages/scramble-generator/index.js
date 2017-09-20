// @flow

import { FaceList, FaceAxisInfo, createMove } from 'scramble-utils-common';
import type { Move } from '../../types';
import { randomInRange, coinFlip } from './helpers';
import formatScramble from './formatter';

export type GenerateConfig = {
  cubeSize?: number,
  length?: number,
  formatted?: boolean
};

/**
 * Generates a random scramble for the given cube size.
 * @example
 * import generateScramble from 'scramble-generator';
 * generateScramble();
 * // R' U F D' L ...
 *
 * generateScramble({ cubeSize: 3, formatted: false });
 * // [ { face: 'U', inverted: false, double: true },
 * // { face: 'R', inverted: true, double: false },
 * // { face: 'D', inverted: false, double: true }, ... ]
 */
const generateScramble = ({
  cubeSize = 3,
  length = (cubeSize - 2) * 20 || 8,
  formatted = true
}: GenerateConfig = {}): string | Move[] => {
  const scramble = [];
  const maxLayers = Math.floor(cubeSize / 2);
  let lastAxis;
  for(let i = 0; i < length; i++) {
    const faceSelections = FaceList.filter(face => FaceAxisInfo[face] !== lastAxis);
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
  return formatted ? formatScramble(scramble) : scramble;
};

export { formatScramble };
export { Faces } from 'scramble-utils-common';

export default generateScramble;
