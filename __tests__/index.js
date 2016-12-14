const sg = require('../index');

describe('Scramble generator', () => {
  const faceList = ['RIGHT', 'UP', 'LEFT', 'DOWN', 'FRONT', 'BACK'];
  const shortFaceList = faceList.map(m => m[0]);

  it('exports the cube moves', () => {
    const {
      R, U, L, D, F, B,
      RIGHT, UP, LEFT, DOWN, FRONT, BACK
    } = sg.Faces;
    expect([R, U, L, D, F, B]).toEqual(shortFaceList);
    expect([RIGHT, UP, LEFT, DOWN, FRONT, BACK]).toEqual(faceList);
  });

  it('generates a scramble for 3x3x3', () => {
    const scramble = sg.generate('3x3x3');
    expect(scramble.length).toBe(20);
    scramble.forEach((move) => {
      expect(typeof move.inverted).toBe('boolean');
      expect(shortFaceList).toContain(move.face);
    });
  });

  it('generates a formatted scramble for 3x3x3', () => {
    expect(sg.formatted('3x3x3').replace(/[' ]/g, '')).toMatch(/[RULDFB]{20}/);
  });

  it('generates different 3x3x3 scrambles', () => {
    expect(sg.formatted('3x3x3')).not.toBe(sg.formatted('3x3x3'));
  });

  it('formats a given scramble for 3x3x3', () => {
    expect(sg.format([{ face: sg.Faces.R, inverted: true }])).toBe("R'");
    expect(sg.format([
      { face: sg.Faces.R, inverted: true },
      { face: sg.Faces.U },
      { face: sg.Faces.F },
      { face: sg.Faces.L },
      { face: sg.Faces.B, inverted: true },
      { face: sg.Faces.D }
    ])).toBe("R' U F L B' D");
  });
});
