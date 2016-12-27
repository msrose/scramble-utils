const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const coinFlip = () => !!randomInRange(0, 2);

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

const SHORT_TO_LONG_MAP = LONG_FACES.reduce((map, face) => {
  map[face[0]] = face;
  return map;
}, {});

const Modifiers = {
  INVERTED: "'",
  DOUBLE: '2'
};

const createMove = ({
  face = LONG_FACES[0],
  inverted = false,
  double = false
}) => {
  if(Faces[face]) {
    face = face[0];
  }
  return {
    face,
    longFace: SHORT_TO_LONG_MAP[face],
    inverted: !double && inverted,
    double
  };
};

const generators = {
  '3x3x3'() {
    const scramble = [];
    let lastAxis;
    for(let i = 0; i < 20; i++) {
      const faceSelections = LONG_FACES.filter(face => FaceAxisInfo[face] !== lastAxis);
      const rand = randomInRange(0, faceSelections.length);
      const longFace = faceSelections[rand];
      lastAxis = FaceAxisInfo[longFace];
      scramble.push(createMove({
        face: longFace,
        inverted: coinFlip(),
        double: coinFlip()
      }));
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
        modifier = Modifiers.DOUBLE;
      } else if(move.inverted) {
        modifier = Modifiers.INVERTED;
      }
      return `${Faces[move.face[0]]}${modifier}`;
    }).join(' ');
};

export const formatted = (puzzle) => {
  return format(generate(puzzle));
};

export const parse = (scrambleString) => {
  if(typeof scrambleString !== 'string') return null;
  scrambleString = scrambleString.replace(/\s/g, '').toUpperCase();
  const moves = [];
  for(let i = 0; i < scrambleString.length; i++) {
    const token = scrambleString[i];
    if(Faces[token]) {
      moves.push(createMove({ face: token }));
    } else {
      const lastMove = moves[moves.length - 1];
      if(!lastMove) {
        return null;
      }
      if(token === Modifiers.INVERTED) {
        if(!lastMove.double) {
          lastMove.inverted = !lastMove.inverted;
        }
      } else if(token === Modifiers.DOUBLE) {
        if(lastMove.double) {
          return null;
        }
        lastMove.double = true;
        lastMove.inverted = false;
      } else {
        return null;
      }
    }
  }
  return moves;
};
