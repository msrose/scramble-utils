import { randomInRange, coinFlip } from './helpers';
import { LONG_FACES, FaceAxisInfo, createMove } from './common';

/**
 * Generates a random scramble for the given cube size.
 * @param {object} [$0]
 * @param {number} [$0.cubeSize=3] - The size (number of layers) of the cube to generate a scramble for
 * @param {number} [$0.length=(cubeSize-2)*20||8] - The number of moves in the generated scramble. Default value depends on cube size.
 * @returns {Move[]} - A list of moves representing the scramble for the cube.
 * @example
 * import { generate } from 'scramble-generator';
 * generate({ cubeSize: 3 });
 * // [ { face: 'U', longFace: 'UP', inverted: false, double: true },
 * // { face: 'R', longFace: 'RIGHT', inverted: true, double: false },
 * // { face: 'D', longFace: 'DOWN', inverted: false, double: true }, ... ]
 */
export const generate = ({ cubeSize = 3, length = (cubeSize - 2) * 20 || 8 } = {}) => {
  const scramble = [];
  const maxLayers = Math.floor(cubeSize / 2);
  let lastAxis;
  for(let i = 0; i < length; i++) {
    const faceSelections = LONG_FACES.filter(face => FaceAxisInfo[face] !== lastAxis);
    const rand = randomInRange(0, faceSelections.length);
    const longFace = faceSelections[rand];
    lastAxis = FaceAxisInfo[longFace];
    scramble.push(createMove({
      face: longFace,
      inverted: coinFlip(),
      double: coinFlip(),
      layerCount: randomInRange(1, maxLayers + 1)
    }));
  }
  return scramble;
};
