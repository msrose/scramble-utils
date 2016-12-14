const Faces = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  UP: 'UP',
  DOWN: 'DOWN',
  FRONT: 'FRONT',
  BACK: 'BACK'
};

const longFaceArray = Object.keys(Faces);
const shortFaceArray = longFaceArray.map(f => f[0]);

shortFaceArray.forEach((f) => Faces[f] = f);

const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generators = {
  '3x3x3'() {
    const scramble = [];
    for(let i = 0; i < 20; i++) {
      const rand = randomInRange(0, longFaceArray.length);
      scramble.push({
        inverted: randomInRange(0, 2) === 0,
        face: shortFaceArray[rand],
        longFace: longFaceArray[rand]
      });
    }
    return scramble;
  }
};

const generate = (puzzle) => {
  return generators[puzzle]();
};

const format = (scramble) => {
  if(!Array.isArray(scramble)) return '';
  return scramble.map(move =>
    !Faces[move.face] ? '' : `${Faces[move.face[0]]}${move.inverted ? "'" : ''}`
  ).join(' ');
};

const formatted = (puzzle) => {
  return format(generate(puzzle));
};

module.exports = {
  Faces,
  generate,
  formatted,
  format
};
