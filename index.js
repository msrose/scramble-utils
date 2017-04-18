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
  DOUBLE: '2',
  WIDE: 'w'
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
        modifier += Modifiers.WIDE;
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

const ModifierMap = Object.keys(Modifiers).reduce((map, key) => {
  const modifier = Modifiers[key];
  map[modifier] = modifier;
  return map;
}, {});

const Tokens = {
  FACE: 'FACE',
  MODIFIER: 'MODIFIER',
  LAYER_COUNT: 'LAYER_COUNT'
};

const tokenize = (scrambleString) => {
  // TODO: use errors (throw or return promise) instead of returning null
  if(typeof scrambleString !== 'string') return null;
  const tokens = [];
  let i = 0;
  while(i < scrambleString.length) {
    let char = scrambleString[i];
    if(/\s/.test(char)) {
      i++;
      continue;
    }
    const face = Faces[char.toUpperCase()];
    if(face) {
      tokens.push({
        type: Tokens.FACE,
        face,
        raw: char
      });
    } else {
      if(/[0-9]/.test(char)) {
        let number = char;
        while(true) { // eslint-disable-line no-constant-condition
          char = scrambleString[i + 1];
          if(/[0-9]/.test(char)) {
            number += String(char);
          } else {
            break;
          }
          i++;
        }
        if(number === Modifiers.DOUBLE) {
          tokens.push({
            type: Tokens.MODIFIER,
            modifier: number,
            raw: number
          });
        } else {
          tokens.push({
            type: Tokens.LAYER_COUNT,
            value: parseInt(number, 10),
            raw: number
          });
        }
      } else {
        const modifier = ModifierMap[char];
        if(modifier) {
          tokens.push({
            type: Tokens.MODIFIER,
            modifier,
            raw: char
          });
        } else {
          return null;
        }
      }
    }
    i++;
  }
  return tokens;
};

const States = {
  START: 'START',
  FACE: 'FACE',
  FACE_AND_NON_WIDE_MODIFIER: 'FACE_AND_NON_WIDE_MODIFIER',
  LAYER_COUNT: 'LAYER_COUNT',
  LAYER_COUNT_AND_FACE: 'LAYER_COUNT_AND_FACE',
  LAYER_COUNT_AND_FACE_AND_NON_WIDE_MODIFIER: 'LAYER_COUNT_AND_FACE_AND_NON_WIDE_MODIFIER',
  LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER: 'LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER'
};

const transition = (state, token) => {
  switch(state) {
    case States.START:
      return { [Tokens.FACE]: States.FACE, [Tokens.LAYER_COUNT]: States.LAYER_COUNT }[token.type];
    case States.FACE:
      if(token.type === Tokens.MODIFIER) {
        if(token.modifier === Modifiers.WIDE) {
          return States.LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER;
        } else {
          return States.FACE_AND_NON_WIDE_MODIFIER;
        }
      }
      return { [Tokens.FACE]: States.FACE, [Tokens.LAYER_COUNT]: States.LAYER_COUNT }[token.type];
    case States.FACE_AND_NON_WIDE_MODIFIER:
      if(token.type === Tokens.MODIFIER) {
        if(token.modifier === Modifiers.WIDE) {
          return States.START;
        }
      }
      return { [Tokens.FACE]: States.FACE, [Tokens.LAYER_COUNT]: States.LAYER_COUNT }[token.type];
    case States.LAYER_COUNT:
      return { [Tokens.FACE]: States.LAYER_COUNT_AND_FACE }[token.type];
    case States.LAYER_COUNT_AND_FACE:
      if(token.type === Tokens.MODIFIER) {
        if(token.modifier === Modifiers.WIDE) {
          return States.LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER;
        } else {
          return States.LAYER_COUNT_AND_FACE_AND_NON_WIDE_MODIFIER;
        }
      }
      break;
    case States.LAYER_COUNT_AND_FACE_AND_NON_WIDE_MODIFIER:
      if(token.type === Tokens.MODIFIER && token.modifier === Modifiers.WIDE) {
        return States.START;
      }
      break;
    case States.LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER:
      if(token.type === Tokens.MODIFIER && token.modifier !== Modifiers.WIDE) {
        return States.START;
      }
      return { [Tokens.FACE]: States.Face, [Tokens.LAYER_COUNT]: States.LAYER_COUNT }[token.type];
  }
};

/**
 * Takes a given string and parses it into a scramble of {@link Move} objects.
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
  // TODO: use errors (throw or return promise) instead of returning null
  const tokens = tokenize(scrambleString);
  if(!tokens) return null;
  const moves = [];
  let state = States.START;
  for(let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const nextState = transition(state, token);
    if(!nextState) return null;
    switch(nextState) {
      case States.FACE:
        moves.push(createMove({ face: token.face }));
        break;
      case States.LAYER_COUNT:
        moves.push(createMove({ layerCount: token.value }));
        break;
      case States.LAYER_COUNT_AND_FACE:
        moves[moves.length - 1].face = token.face;
        break;
      case States.START:
      case States.FACE_AND_NON_WIDE_MODIFIER:
      case States.LAYER_COUNT_AND_FACE_AND_NON_WIDE_MODIFIER:
      case States.LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER: {
        const lastMove = moves[moves.length - 1];
        switch(token.modifier) {
          case Modifiers.WIDE:
            if(lastMove.layerCount < 2) {
              lastMove.layerCount = 2;
            }
            break;
          case Modifiers.DOUBLE:
            lastMove.double = true;
            break;
          case Modifiers.INVERTED:
            lastMove.inverted = true;
            break;
        }
        break;
      }
    }
    state = nextState;
  }
  if(state !== States.START &&
     state !== States.FACE &&
     state !== States.FACE_AND_NON_WIDE_MODIFIER &&
     state !== States.LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER) {
    return null;
  }
  return moves;
};
