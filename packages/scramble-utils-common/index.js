// @flow

import type { Face, Modifier, Move } from '../../types';

/**
 * Axes for a cubic puzzle
 */
export const Axes = {
  X: 'X',
  Y: 'Y',
  Z: 'Z'
};

/**
 * Mapping from face to axis around which it turns
 */
export const FaceAxisInfo = {
  R: Axes.X,
  L: Axes.X,
  U: Axes.Y,
  D: Axes.Y,
  F: Axes.Z,
  B: Axes.Z
};

/**
 * List of faces
 */
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
 * Mapping of name constant to corresponding scramble modifier
 */
export const Modifiers: { [string]: Modifier } = {
  INVERTED: "'",
  DOUBLE: '2',
  WIDE: 'w'
};

type MoveConfig = {
  face?: Face,
  inverted?: boolean,
  double?: boolean,
  layerCount?: number
};

/**
 * Creates a move for a scramble.
 * @returns An object representing a move for a scramble
 */
export const createMove = (move: MoveConfig): Move => {
  const { face = Faces.R, inverted = false, double = false, layerCount = 1 } = move;
  return {
    face,
    inverted: !double && inverted,
    double,
    layerCount
  };
};
