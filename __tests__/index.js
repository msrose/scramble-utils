import { Faces, generate, format, formatted, parse } from '../index';

describe('Scramble generator', () => {
  const faceList = ['RIGHT', 'UP', 'LEFT', 'DOWN', 'FRONT', 'BACK'];
  const shortFaceList = faceList.map(m => m[0]);

  it('exports the cube moves', () => {
    const {
      R, U, L, D, F, B,
      RIGHT, UP, LEFT, DOWN, FRONT, BACK
    } = Faces;
    expect([R, U, L, D, F, B]).toEqual(shortFaceList);
    expect([RIGHT, UP, LEFT, DOWN, FRONT, BACK]).toEqual(faceList);
  });

  it('generates a scramble for 3x3x3', () => {
    const scramble = generate('3x3x3');
    expect(scramble.length).toBe(20);
    scramble.forEach((move) => {
      expect(typeof move.inverted).toBe('boolean');
      expect(typeof move.double).toBe('boolean');
      expect(shortFaceList).toContain(move.face);
    });
  });

  it('generates a formatted scramble for 3x3x3', () => {
    expect(formatted('3x3x3').replace(/[2' ]/g, '')).toMatch(/[RULDFB]{20}/);
  });

  it('generates different 3x3x3 scrambles', () => {
    expect(formatted('3x3x3')).not.toBe(formatted('3x3x3'));
  });

  it('formats a given scramble for 3x3x3', () => {
    expect(format([{ face: Faces.R, inverted: true }])).toBe("R'");
    expect(format([
      { face: Faces.R, inverted: true },
      { face: Faces.U, double: true },
      { face: Faces.F },
      { face: Faces.L },
      { face: Faces.B, inverted: true },
      { face: Faces.D }
    ])).toBe("R' U2 F L B' D");
    expect(format([
      { face: Faces.RIGHT, inverted: true },
      { face: Faces.UP },
      { face: Faces.FRONT }
    ])).toBe("R' U F");
  });

  it("doesn't include invalid moves in a formatted scramble", () => {
    expect(format([{ face: 'Q' }])).toBe('');
    expect(format([{ face: 'Q' }, { face: Faces.UP }])).toBe('U');
  });

  it('parses a scramble string into array format', () => {
    expect(parse("R U2 R' U'")).toEqual([
      jasmine.objectContaining({ face: 'R', inverted: false, double: false }),
      jasmine.objectContaining({ face: 'U', inverted: false, double: true }),
      jasmine.objectContaining({ face: 'R', inverted: true, double: false }),
      jasmine.objectContaining({ face: 'U', inverted: true, double: false })
    ]);
    expect(parse('d   f b  l')).toEqual([
      jasmine.objectContaining({ face: 'D', longFace: 'DOWN' }),
      jasmine.objectContaining({ face: 'F', longFace: 'FRONT' }),
      jasmine.objectContaining({ face: 'B', longFace: 'BACK' }),
      jasmine.objectContaining({ face: 'L', longFace: 'LEFT' })
    ]);
    expect(parse('  ')).toEqual([]);
  });

  it('handles redundant modifiers when parsing', () => {
    expect(parse("R2' L'2 F'' B'''")).toEqual([
      jasmine.objectContaining({ face: 'R', inverted: false, double: true }),
      jasmine.objectContaining({ face: 'L', inverted: false, double: true }),
      jasmine.objectContaining({ face: 'F', inverted: false, double: false }),
      jasmine.objectContaining({ face: 'B', inverted: true, double: false })
    ]);
  });

  it('returns null for invalid sequences when parsing', () => {
    expect(parse('llamas')).toBeNull();
    expect(parse(function() {})).toBeNull();
    expect(parse(null)).toBeNull();
    expect(parse({})).toBeNull();
    expect(parse('R22')).toBeNull();
  });
});
