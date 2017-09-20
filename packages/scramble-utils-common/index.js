// @flow

import type { Face, Modifier, Move } from '../../types';

export const Axes = {
  X: 'X',
  Y: 'Y',
  Z: 'Z'
};

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

export const createMove = (move: MoveConfig): Move => {
  const { face = Faces.R, inverted = false, double = false, layerCount = 1 } = move;
  return {
    face,
    inverted: !double && inverted,
    double,
    layerCount
  };
};
