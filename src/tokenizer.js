import { Modifiers, Faces, Tokens } from './common';

const ModifierMap = Object.keys(Modifiers).reduce((map, key) => {
  const modifier = Modifiers[key];
  map[modifier] = modifier;
  return map;
}, {});

export const tokenize = (scrambleString) => {
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
