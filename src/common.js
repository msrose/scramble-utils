// @flow

/* globals $Keys */

export const Axes = {
  X: 'X',
  Y: 'Y',
  Z: 'Z'
};
export type Axis = $Keys<typeof Axes>;

export const FaceAxisInfo: { [Face]: Axis } = {
  R: Axes.X,
  L: Axes.X,
  U: Axes.Y,
  D: Axes.Y,
  F: Axes.Z,
  B: Axes.Z
};
export type Face = $Keys<typeof FaceAxisInfo>;
const FaceList = Object.keys(FaceAxisInfo);
export const Faces = FaceList.reduce((map, face) => Object.assign(map, { [face]: face }), {});

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
  const { face = Faces[0], inverted = false, double = false, layerCount = 1 } = move;
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
