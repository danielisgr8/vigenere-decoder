const format = (obj) => JSON.stringify(obj, null, 2);

class State {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }

  hasInnerNext() {
    return false;
  }

  getNext() {
    return this.next;
  }
}

class ShingleDistancesState extends State {
  constructor(size, distances) {
    super(`Shingle Distances (${size})`, format(distances));
  }
}

class ShingleDenomsState extends State {
  constructor(size, denoms) {
    super(`Shingle Denoms (${size})`, format(denoms));
  }
}

class DenomSumState extends State {
  constructor(denomSums) {
    super("Denom Sums", format(denomSums));
  }
}

class KeyLengthsState extends State {
  constructor(keyLengths) {
    super("Key Lengths", format(keyLengths));
  }
}

class GroupingState extends State {
  constructor(keyLength, i, string) {
    super(`String (Length ${keyLength}, Group ${i})`, string);
  }
}

class FrequenciesState extends State {
  constructor(keyLength, i, frequencies) {
    super(`Frequencies (Length ${keyLength}, Group ${i})`, format(frequencies));
  }
}

class DiffSumsState extends State {
  constructor(keyLength, i, diffSums) {
    super(`Diff Sum (Length ${keyLength}, Group ${i})`, format(diffSums));
  }
}

class ValidIState extends State {
  constructor(keyLength, i, valid) {
    super(`Valid Shifts (Length ${keyLength}, Group ${i})`, format(valid));
  }
}

class ValidState extends State {
  constructor(valid) {
    super(`Valid Shifts (Overall)`, format(valid));
  }
}

class KeysState extends State {
  constructor(keys) {
    super(`Key Guesses`, format(keys));
  }
}

export {
  State,
  ShingleDistancesState,
  ShingleDenomsState,
  DenomSumState,
  KeyLengthsState,
  GroupingState,
  FrequenciesState,
  DiffSumsState,
  ValidIState,
  ValidState,
  KeysState
};
