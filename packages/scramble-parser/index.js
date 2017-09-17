// @flow

import { Tokens, Modifiers, createMove } from '../../common';
import { tokenize } from './tokenizer';
import type { Token, Move, TokenType } from '../../common';

const States = {
  START: 'START',
  FACE: 'FACE',
  FACE_AND_NON_WIDE_MODIFIER: 'FACE_AND_NON_WIDE_MODIFIER',
  LAYER_COUNT: 'LAYER_COUNT',
  LAYER_COUNT_AND_FACE: 'LAYER_COUNT_AND_FACE',
  LAYER_COUNT_AND_FACE_AND_NON_WIDE_MODIFIER: 'LAYER_COUNT_AND_FACE_AND_NON_WIDE_MODIFIER',
  LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER: 'LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER'
};

type State = $Keys<typeof States>;

const getNextState = (transitions: { [TokenType]: State }, tokenType: TokenType): ?State => {
  // explicitly list all possible TokenTypes in this literal for flow
  const defaults = {
    [Tokens.FACE]: void 0,
    [Tokens.LAYER_COUNT]: void 0,
    [Tokens.MODIFIER]: void 0
  };
  return Object.assign(defaults, transitions)[tokenType];
};

const transition = (state: State, token: Token): ?State => {
  switch(state) {
    case States.START:
      return getNextState({ [Tokens.FACE]: States.FACE, [Tokens.LAYER_COUNT]: States.LAYER_COUNT }, token.type);
    case States.FACE:
      if(token.type === Tokens.MODIFIER) {
        if(token.modifier === Modifiers.WIDE) {
          return States.LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER;
        } else {
          return States.FACE_AND_NON_WIDE_MODIFIER;
        }
      }
      return getNextState({ [Tokens.FACE]: States.FACE, [Tokens.LAYER_COUNT]: States.LAYER_COUNT }, token.type);
    case States.FACE_AND_NON_WIDE_MODIFIER:
      if(token.type === Tokens.MODIFIER) {
        if(token.modifier === Modifiers.WIDE) {
          return States.START;
        }
      }
      return getNextState({ [Tokens.FACE]: States.FACE, [Tokens.LAYER_COUNT]: States.LAYER_COUNT }, token.type);
    case States.LAYER_COUNT:
      return getNextState({ [Tokens.FACE]: States.LAYER_COUNT_AND_FACE }, token.type);
    case States.LAYER_COUNT_AND_FACE:
      if(token.type === Tokens.MODIFIER) {
        if(token.modifier === Modifiers.WIDE) {
          return States.LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER;
        } else {
          return States.LAYER_COUNT_AND_FACE_AND_NON_WIDE_MODIFIER;
        }
      }
      break;
    case States.LAYER_COUNT_AND_FACE_AND_NON_WIDE_MODIFIER:
      if(token.type === Tokens.MODIFIER && token.modifier === Modifiers.WIDE) {
        return States.START;
      }
      break;
    case States.LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER:
      if(token.type === Tokens.MODIFIER && token.modifier !== Modifiers.WIDE) {
        return States.START;
      }
      return getNextState({ [Tokens.FACE]: States.FACE, [Tokens.LAYER_COUNT]: States.LAYER_COUNT }, token.type);
  }
};

/**
 * Takes a given string and parses it into a scramble of {@link Move} objects.
 * @param {string} scrambleString - The string to be parse as a scramble.
 * @returns {Move[]|null} - An array of Move objects representing the given scramble, or null if the scramble isn't valid.
 * @example
 * import { parse } from 'scramble-generator';
 * parse("R' U F D2");
 * // [ { face: 'R', inverted: true, double: false },
 * // { face: 'U', inverted: false, double: false },
 * // { face: 'F', inverted: false, double: false },
 * // { face: 'D', inverted: false, double: true } ]
 *
 * parse("R J Q D2 F U'"); // null
 */
const parseScramble = (scrambleString: string): Move[] | null => {
  // TODO: use errors (throw or return promise) instead of returning null
  const tokens = tokenize(scrambleString);
  if(!tokens) return null;
  const moves = [];
  let state = States.START;
  for(let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const nextState = transition(state, token);
    if(!nextState) return null;
    switch(nextState) {
      case States.FACE:
        moves.push(createMove({ face: token.face }));
        break;
      case States.LAYER_COUNT:
        moves.push(createMove({ layerCount: token.value }));
        break;
      case States.LAYER_COUNT_AND_FACE:
        if(token.face) { // this check is needed for flow
          moves[moves.length - 1].face = token.face;
        }
        break;
      case States.START:
      case States.FACE_AND_NON_WIDE_MODIFIER:
      case States.LAYER_COUNT_AND_FACE_AND_NON_WIDE_MODIFIER:
      case States.LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER: {
        const lastMove = moves[moves.length - 1];
        switch(token.modifier) {
          case Modifiers.WIDE:
            if(lastMove.layerCount < 2) {
              lastMove.layerCount = 2;
            }
            break;
          case Modifiers.DOUBLE:
            lastMove.double = true;
            break;
          case Modifiers.INVERTED:
            lastMove.inverted = true;
            break;
        }
        break;
      }
    }
    state = nextState;
  }
  if(state !== States.START &&
     state !== States.FACE &&
     state !== States.FACE_AND_NON_WIDE_MODIFIER &&
     state !== States.LAYER_COUNT_AND_FACE_AND_WIDE_MODIFIER) {
    return null;
  }
  return moves;
};

export default parseScramble;
