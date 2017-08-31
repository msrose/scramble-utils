import { Faces, Modifiers } from './common';
import { generate } from './generator';
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
