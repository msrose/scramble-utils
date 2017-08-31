// @flow

export const Axes = {
  X: 'X',
  Y: 'Y',
  Z: 'Z'
};

export const FaceAxisInfo = {
  RIGHT: Axes.X,
  LEFT: Axes.X,
  UP: Axes.Y,
  DOWN: Axes.Y,
  FRONT: Axes.Z,
  BACK: Axes.Z
};

export const LONG_FACES = Object.keys(FaceAxisInfo);

export const SHORT_TO_LONG_MAP = LONG_FACES.reduce((map, face) => {
  map[face[0]] = face;
  return map;
}, {});

export const Modifiers = {
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

export type MoveConfig = {
  face: string,
  inverted: boolean,
  double: boolean,
  layerCount: number
};

export type Move = {
  face: string,
  longFace: string,
  inverted: boolean,
  double: boolean,
  layerCount: number
};

export const createMove = ({ face = LONG_FACES[0], inverted = false, double = false, layerCount = 1 }: MoveConfig): Move => {
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

export const Tokens = {
  FACE: 'FACE',
  MODIFIER: 'MODIFIER',
  LAYER_COUNT: 'LAYER_COUNT'
};
