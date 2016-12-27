const Axes = {
  X: 'X',
  Y: 'Y',
  Z: 'Z'
};

const FaceAxisInfo = {
  RIGHT: Axes.X,
  LEFT: Axes.X,
  UP: Axes.Y,
  DOWN: Axes.Y,
  FRONT: Axes.Z,
  BACK: Axes.Z
};

const LONG_FACES = Object.keys(FaceAxisInfo);

const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const coinFlip = () => !!randomInRange(0, 2);

const generators = {
  '3x3x3'() {
    const scramble = [];
    let lastAxis;
    for(let i = 0; i < 20; i++) {
      const faceSelections = LONG_FACES.filter(face => FaceAxisInfo[face] !== lastAxis);
      const rand = randomInRange(0, faceSelections.length);
      const inverted = coinFlip();
      const double = coinFlip();
      const longFace = faceSelections[rand];
      lastAxis = FaceAxisInfo[longFace];
      scramble.push({
        inverted: !double && inverted,
        double,
        face: longFace[0],
        longFace
      });
    }
    return scramble;
  }
};

export const Faces = LONG_FACES.reduce((faceMap, faceName) => {
  faceMap[faceName] = faceName;
  const shortName = faceName[0];
  faceMap[shortName] = shortName;
  return faceMap;
}, {});

export const generate = (puzzle) => {
  return generators[puzzle]();
};

export const format = (scramble) => {
  if(!Array.isArray(scramble)) return '';
  return scramble
    .filter(move => Faces[move.face])
    .map(move => {
      let modifier = '';
      if(move.double) {
        modifier = '2';
      } else if(move.inverted) {
        modifier = "'";
      }
      return `${Faces[move.face[0]]}${modifier}`;
    }).join(' ');
};

export const formatted = (puzzle) => {
  return format(generate(puzzle));
};
