const Faces = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  UP: 'UP',
  DOWN: 'DOWN',
  FRONT: 'FRONT',
  BACK: 'BACK'
};

const faceArray = Object.keys(Faces);

for(const face in Faces) {
  Faces[face[0]] = Faces[face];
}

const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generators = {
  '3x3x3'() {
    const scramble = [];
    for(let i = 0; i < 20; i++) {
      const face = faceArray[randomInRange(0, faceArray.length)];
      scramble.push({
        inverted: randomInRange(0, 2) === 0,
        face: face[0],
        longFace: face
      });
    }
    return scramble;
  }
};

const generate = (puzzle) => {
  return generators[puzzle]();
};

const formatted = (puzzle) => {
  return generate(puzzle).map(move =>
    `${move.face}${move.inverted ? "'" : ''}`
  ).join(' ');
};

module.exports = {
  Faces,
  generate,
  formatted
};
