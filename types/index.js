// @flow

import { Axes, FaceAxisInfo } from '../packages/scramble-utils-common';

export type Axis = $Keys<typeof Axes>;

/**
 * The face of the cube to turn is represented by a single-character string
 */
export type Face = $Keys<typeof FaceAxisInfo>;

export type Modifier = "'" | '2' | 'w';

/**
 * A turn of the cube is represented throughout as a Move object, which has all the properties necessary to describe how a given turn must be executed.
 */
export type Move = {
  face: Face,
  inverted: boolean,
  double: boolean,
  layerCount: number
};

