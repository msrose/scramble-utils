import { Faces, generate, format, formatted, parse } from '../index';

describe('Scramble generator', () => {
  const faceList = ['R', 'U', 'L', 'D', 'F', 'B'];

  it('exports the cube moves', () => {
    expect(Faces).toEqual(expect.objectContaining({
      R: 'R', U: 'U', L: 'L', D: 'D', F: 'F', B: 'B'
    }));
  });

  it('generates a scramble for 3x3x3 by default', () => {
    const scramble = generate();
    expect(scramble.length).toBe(20);
    scramble.forEach((move) => {
      expect(typeof move.inverted).toBe('boolean');
      expect(typeof move.double).toBe('boolean');
      expect(typeof move.layerCount).toBe('number');
      expect(faceList).toContain(move.face);
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
      { face: Faces.R, inverted: true },
      { face: Faces.U },
      { face: Faces.F }
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
    expect(format([{ face: 'Q' }, { face: Faces.U }])).toBe('U');
  });

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
