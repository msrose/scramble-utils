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

  it('generates a scramble for 3x3x3 by default', () => {
    const scramble = generate();
    expect(scramble.length).toBe(20);
    scramble.forEach((move) => {
      expect(typeof move.inverted).toBe('boolean');
      expect(typeof move.double).toBe('boolean');
      expect(typeof move.layerCount).toBe('number');
      expect(shortFaceList).toContain(move.face);
    });
  });

  it('generates a scramble of the specified length', () => {
    const scramble = generate({ length: 14 });
    expect(scramble.length).toBe(14);
  });

  it('generates a formatted scramble for 3x3x3', () => {
    expect(formatted({ cubeSize: 3 }).replace(/[2' ]/g, '')).toMatch(/[RULDFB]{20}/);
  });

  it('generates different 3x3x3 scrambles', () => {
    expect(formatted({ cubeSize: 3 })).not.toBe(formatted({ cubeSize: 3 }));
  });

  it('generates scrambles for other cubes', () => {
    expect(generate({ cubeSize: 2 }).length).toBe(8);
    expect(generate({ cubeSize: 4 }).length).toBe(40);
    expect(generate({ cubeSize: 5 }).length).toBe(60);
    expect(generate({ cubeSize: 6 }).length).toBe(80);
    expect(generate({ cubeSize: 7 }).length).toBe(100);
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

  it('formats a scramble for other cubes', () => {
    expect(format([
      { face: Faces.R, inverted: true, layerCount: 2 },
      { face: Faces.U, double: true, layerCount: 3 },
      { face: Faces.F }
    ])).toBe("Rw' 3Uw2 F");
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

  it('parses a scramble with wide modifiers', () => {
    expect(parse("Rw2' L'w2 Fw B'w")).toEqual([
      jasmine.objectContaining({ face: 'R', inverted: false, double: true, layerCount: 2 }),
      jasmine.objectContaining({ face: 'L', inverted: false, double: true, layerCount: 2 }),
      jasmine.objectContaining({ face: 'F', inverted: false, double: false, layerCount: 2 }),
      jasmine.objectContaining({ face: 'B', inverted: true, double: false, layerCount: 2 })
    ]);
  });

  it('returns null for invalid sequences when parsing', () => {
    expect(parse('llamas')).toBeNull();
    expect(parse(function() {})).toBeNull();
    expect(parse(null)).toBeNull();
    expect(parse({})).toBeNull();
    expect(parse('R22')).toBeNull();
    expect(parse('Rww')).toBeNull();
  });
});
