// @flow

/* globals $Keys */

export const Axes = {
  X: 'X',
  Y: 'Y',
  Z: 'Z'
};

export type Axis = $Keys<typeof Axes>;

export const FaceAxisInfo = {
  R: Axes.X,
  L: Axes.X,
  U: Axes.Y,
  D: Axes.Y,
  F: Axes.Z,
  B: Axes.Z
};

export const FaceList = Object.keys(FaceAxisInfo);

/**
 * Map of Faces.
 * @example
 * import { Faces } from 'scramble-generator';
 * Faces.R; // 'R'
 * Faces.U; // 'U'
 */
export const Faces: { [Face]: Face } = FaceList.reduce(
  (map, face) => Object.assign(map, { [face]: face }),
  {}
);

/**
 * The face of the cube to turn is represented by a single-character string
 */
export type Face = $Keys<typeof FaceAxisInfo>;

export const Modifiers = {
  INVERTED: "'",
  DOUBLE: '2',
  WIDE: 'w'
};

/**
 * A turn of the cube is represented throughout as a Move object, which has all the properties necessary to describe how a given turn must be executed.
 */
export type Move = {
  face: Face,
  inverted: boolean,
  double: boolean,
  layerCount: number
};

type MoveConfig = Move;

export const createMove = (move: MoveConfig): Move => {
  const { face = Faces.R, inverted = false, double = false, layerCount = 1 } = move;
  return {
    face,
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
