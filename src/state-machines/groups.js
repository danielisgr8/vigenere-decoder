import {
  State,
  ShingleDistancesState,
  ShingleDenomsState,
  GroupingState,
  FrequenciesState,
  DiffSumsState,
  ValidIState,
  ValidState
} from "./states";

class Group extends State {
  constructor(states) {
    super(states[0].title, states[0].body);
    this.states = states;
    this.i = 0;
  }

  setFinalNext(state) {
    this.finalNext = state;
  }

  hasInnerNext() {
    if(this.states[this.i] instanceof Group) {
      return this.states[this.i].hasInnerNext();
    } else {
      return this.i < this.states.length - 1;
    }
  }

  getNext() {
    if(!this.states[this.i].hasInnerNext()) {
      this.i++;
    } else {
      this.states[this.i].getNext();
    }
    if(this.i < this.states.length) {
      this.title = this.states[this.i].title;
      this.body = this.states[this.i].body;
      return this;
    } else {
      return this.finalNext;
    }
  }
}

class ShingleGroup extends Group {
  constructor(details) {
    const distancesState = new ShingleDistancesState(details.size, details.distances);
    const denomsState = new ShingleDenomsState(details.size, details.denoms);
    super([distancesState, denomsState]);
  }
}

class KeyGroupGroup extends Group {
  constructor(keyLength, details) {
    const groupingState = new GroupingState(keyLength, details.i, details.str);
    const frequenciesState = new FrequenciesState(keyLength, details.i, details.frequencies);
    const diffSumsState = new DiffSumsState(keyLength, details.i, details.diffSums);
    const validIState = new ValidIState(keyLength, details.i, details.valid);
    super([groupingState, frequenciesState, diffSumsState, validIState]);
  }
}

class KeyLengthGroup extends Group {
  constructor(details) {
    const states = [];
    for(let i = 0; i < details.groups.length; i++) {
      const group = details.groups[i];
      states.push(new KeyGroupGroup(details.length, group));
    }
    states.push(new ValidState(details.valid));
    super(states);
  }
}

export { ShingleGroup, KeyLengthGroup };
