// @flow

import { Modifiers, Tokens, FaceList } from './common';
import type { Token } from './common';

export const tokenize = (scrambleString: string): Token[] | null => {
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
    // Use find here instead of object map for flow
    const face = FaceList.find(face => face === char.toUpperCase());
    if(face) {
      tokens.push({
        type: Tokens.FACE,
        face,
        raw: char
      });
    } else {
      if(/[0-9]/.test(char)) {
        let number = char;
        for(;;) {
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
            modifier: Modifiers.DOUBLE, // explicitly stating Modifier for flow
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
        // using these next two lines instead of a map because of flow
        const key = Object.keys(Modifiers).find(key => Modifiers[key] === char);
        const modifier = key && Modifiers[key];
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
