import { Faces } from '../../../common';
import generate, { formatScramble as format } from '../index';

describe('scramble-generator', () => {
  it('generates a scramble for 3x3x3 by default', () => {
    const scramble = generate({ formatted: false });
    expect(scramble.length).toBe(20);
  });

  it('generates a scramble of the specified length', () => {
    const scramble = generate({ length: 14, formatted: false });
    expect(scramble.length).toBe(14);
  });

  it('generates a formatted scramble for 3x3x3', () => {
    expect(generate({ cubeSize: 3 }).replace(/[2' ]/g, '')).toMatch(/[RULDFB]{20}/);
  });

  it('generates different 3x3x3 scrambles', () => {
    expect(generate({ cubeSize: 3 })).not.toBe(generate({ cubeSize: 3 }));
  });

  it('generates scrambles for other cubes', () => {
    expect(generate({ cubeSize: 2, formatted: false }).length).toBe(8);
    expect(generate({ cubeSize: 4, formatted: false }).length).toBe(40);
    expect(generate({ cubeSize: 5, formatted: false }).length).toBe(60);
    expect(generate({ cubeSize: 6, formatted: false }).length).toBe(80);
    expect(generate({ cubeSize: 7, formatted: false }).length).toBe(100);
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
});
