// @flow

import { Faces, Modifiers } from 'scramble-utils-common';
import type { Move } from '../../../types';

/**
 * Formats a given scramble as a string.
 * @param [scramble] List of Move objects representing a scramble to be formatted.
 * @returns String representation of the given scramble.
 * @example
 * import { formatScramble } from 'scramble-generator';
 * import { Faces } from 'scramble-utils-common';
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
const formatScramble = (scramble: Move[]): string => {
  if(!Array.isArray(scramble)) return '';
  return scramble
    .filter(move => Faces[move.face])
    .map(({ double, inverted, layerCount, face }: Move): string => {
      let modifier = '';
      if(layerCount > 1) {
        modifier += Modifiers.WIDE;
      }
      if(double) {
        modifier += Modifiers.DOUBLE;
      } else if(inverted) {
        modifier += Modifiers.INVERTED;
      }
      return `${layerCount > 2 ? layerCount : ''}${face}${modifier}`;
    }).join(' ');
};

export default formatScramble;
