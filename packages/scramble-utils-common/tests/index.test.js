import { Faces } from '../src';

describe('Scramble generator', () => {
  it('exports the cube moves', () => {
    expect(Faces).toEqual({
      R: 'R', U: 'U', L: 'L', D: 'D', F: 'F', B: 'B'
    });
  });
});
