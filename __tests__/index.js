const sg = require('../index');

describe('Scramble generator', () => {
  it('generates a scramble for 3x3x3', () => {
    expect(sg('3x3x3').split(' ').length).toBe(20);
    expect(sg('3x3x3').replace(/ /g, '')).toMatch(/[RUFDLB']{20,40}/);
  });
});
