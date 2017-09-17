// @noflow

import parse from '../index';

describe('scramble-parser', () => {
  it('parses a scramble string into array format', () => {
    expect(parse("R U2 R' U'")).toEqual([
      expect.objectContaining({ face: 'R', inverted: false, double: false }),
      expect.objectContaining({ face: 'U', inverted: false, double: true }),
      expect.objectContaining({ face: 'R', inverted: true, double: false }),
      expect.objectContaining({ face: 'U', inverted: true, double: false })
    ]);
    expect(parse('d   f b  l')).toEqual([
      expect.objectContaining({ face: 'D' }),
      expect.objectContaining({ face: 'F' }),
      expect.objectContaining({ face: 'B' }),
      expect.objectContaining({ face: 'L' })
    ]);
    expect(parse('  ')).toEqual([]);
  });

  it('parses a scramble with wide modifiers', () => {
    expect(parse("Rw' Lw2 F2w B'w")).toEqual([
      expect.objectContaining({ face: 'R', inverted: true, double: false, layerCount: 2 }),
      expect.objectContaining({ face: 'L', inverted: false, double: true, layerCount: 2 }),
      expect.objectContaining({ face: 'F', inverted: false, double: true, layerCount: 2 }),
      expect.objectContaining({ face: 'B', inverted: true, double: false, layerCount: 2 })
    ]);
  });

  it('parses a scramble with layer counts', () => {
    expect(parse("3Rw2 4Lw' 9Fw 35Bw")).toEqual([
      expect.objectContaining({ face: 'R', inverted: false, double: true, layerCount: 3 }),
      expect.objectContaining({ face: 'L', inverted: true, double: false, layerCount: 4 }),
      expect.objectContaining({ face: 'F', inverted: false, double: false, layerCount: 9 }),
      expect.objectContaining({ face: 'B', inverted: false, double: false, layerCount: 35 })
    ]);
  });

  it('parses scrambles with layer counts beginning with 2', () => {
    expect(parse('23Rw')).toEqual([expect.objectContaining({ face: 'R', layerCount: 23 })]);
  });

  it('does not parse scrambles with layer counts and no wide modifier', () => {
    expect(parse('3Rw2 4L')).toBeNull();
    expect(parse('3Rw2 4L 9Fw')).toBeNull();
  });

  it('returns null for invalid sequences when parsing', () => {
    expect(parse('llamas')).toBeNull();
    expect(parse(function() {})).toBeNull();
    expect(parse(null)).toBeNull();
    expect(parse({})).toBeNull();
    expect(parse('R22')).toBeNull();
    expect(parse('Rww')).toBeNull();
    expect(parse("R''")).toBeNull();
  });
});
