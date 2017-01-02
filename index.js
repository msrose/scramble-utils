/**
 * @module scramble-generator
 * @author Michael Rose
 * @license https://github.com/msrose/scramble-generator/blob/master/LICENSE
 */

import { randomInRange, coinFlip } from './helpers';

const Axes = {
  X: 'X',
  Y: 'Y',
  Z: 'Z'
};

const FaceAxisInfo = {
  RIGHT: Axes.X,
  LEFT: Axes.X,
  UP: Axes.Y,
  DOWN: Axes.Y,
  FRONT: Axes.Z,
  BACK: Axes.Z
};

const LONG_FACES = Object.keys(FaceAxisInfo);

const SHORT_TO_LONG_MAP = LONG_FACES.reduce((map, face) => {
  map[face[0]] = face;
  return map;
}, {});

const Modifiers = {
  INVERTED: "'",
  DOUBLE: '2'
};

/**
 * A turn of the cube is represented throughout as a Move object, which has all the properties necessary to describe how a given turn must be executed.
 * @typedef {object} Move
 * @property {string} face - The short name of the face to turn e.g. 'R'
 * @property {string} longFace - The long name of the face to turn e.g. 'RIGHT'
 * @property {boolean} inverted - Indicates if the turn is to be made clockwise (`false`) or counter-clockwise (`true`)
 * @property {boolean} double - Indicates if the turn is 180 degrees. If `true`, `inverted` will always be `false`.
 * @property {number} layerCount - Indicates how many layers should be turned. Will be at least `1` and at most `Math.floor(cubeSize / 2)`.
 */

/**
 * Map of constants representing names of cube faces. The keys are 'RIGHT', 'UP', 'LEFT', 'DOWN', 'BACK', and 'FRONT'.
 * @enum {string}
 * @example
 * import { Faces } from 'scramble-generator';
 * Faces.RIGHT; // 'RIGHT'
 * Faces.R; // 'R'
 */
export const Faces = LONG_FACES.reduce((faceMap, faceName) => {
  faceMap[faceName] = faceName;
  const shortName = faceName[0];
  faceMap[shortName] = shortName;
  return faceMap;
}, {});

const createMove = ({ face = LONG_FACES[0], inverted = false, double = false, layerCount = 1 }) => {
  if(Faces[face]) {
    face = face[0];
  }
  return {
    face,
    longFace: SHORT_TO_LONG_MAP[face],
    inverted: !double && inverted,
    double,
    layerCount
  };
};

/**
 * Generates a random scramble for the given cube size.
 * @param {object} [options]
 * @param {number} [options.cubeSize] - The size (number of layers) of the cube to generate a scramble for
 * @param {number} [options.length] - The number of moves in the generated scramble. Default value depends on cube size.
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

/**
 * Formats a given scramble as a string.
 * @param {Move[]} [scramble] - List of Move objects representing a scramble to be formatted.
 * @returns {string} - String representation of the given scramble.
 * @example
 * import { format, Faces } from 'scramble-generator';
 * format([{
 *   face: Faces.R,
 *   inverted: true
 * }, {
 *   face: Faces.U,
 *   double: true
 * }, {
 *   face: Faces.L
 * }])
 * // "R' U2 L"
 */
export const format = (scramble) => {
  if(!Array.isArray(scramble)) return '';
  return scramble
    .filter(move => Faces[move.face])
    .map(({ double, inverted, layerCount, face }) => {
      let modifier = '';
      if(layerCount > 1) {
        modifier += 'w';
      }
      if(double) {
        modifier += Modifiers.DOUBLE;
      } else if(inverted) {
        modifier += Modifiers.INVERTED;
      }
      return `${layerCount > 2 ? layerCount : ''}${Faces[face[0]]}${modifier}`;
    }).join(' ');
};

/**
 * Generates a random formatted scramble.
 * @param {object} [options] - Same options passed to `generate`
 * @returns {string} - The formatted scramble.
 * @example
 * import { formatted } from 'scramble-generator';
 * formatted({ cubeSize: 3 }); // "F2 R2 F D2 L U2 L U2 F2 D2 R' F2 L' D' B2 R2 F2 R2 F2 R2"
 * @see {@link generate}
 */
export const formatted = (options) => {
  return format(generate(options));
};

/**
 * Takes a given string and parses it into as scramble of {@link Move} objects.
 * @param {string} scrambleString - The string to be parse as a scramble.
 * @returns {Move[]|null} - An array of Move objects representing the given scramble, or null if the scramble isn't valid.
 * @example
 * import { parse } from 'scramble-generator';
 * parse("R' U F D2");
 * // [ { face: 'R', longFace: 'RIGHT', inverted: true, double: false },
 * // { face: 'U', longFace: 'UP', inverted: false, double: false },
 * // { face: 'F', longFace: 'FRONT', inverted: false, double: false },
 * // { face: 'D', longFace: 'DOWN', inverted: false, double: true } ]
 *
 * parse("R J Q D2 F U'"); // null
 */
export const parse = (scrambleString) => {
  if(typeof scrambleString !== 'string') return null;
  scrambleString = scrambleString.replace(/\s/g, '').toUpperCase();
  const moves = [];
  for(let i = 0; i < scrambleString.length; i++) {
    const token = scrambleString[i];
    if(Faces[token]) {
      moves.push(createMove({ face: token }));
    } else {
      const lastMove = moves[moves.length - 1];
      if(!lastMove) {
        return null;
      }
      if(token === Modifiers.INVERTED) {
        if(!lastMove.double) {
          lastMove.inverted = !lastMove.inverted;
        }
      } else if(token === Modifiers.DOUBLE) {
        if(lastMove.double) {
          return null;
        }
        lastMove.double = true;
        lastMove.inverted = false;
      } else {
        return null;
      }
    }
  }
  return moves;
};
