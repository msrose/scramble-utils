const generators = {
  '3x3x3'() {
    return 'R U R U R U R U R U R U R U R U R U R U';
  }
};

module.exports = (puzzle) => {
  return generators[puzzle]();
};
