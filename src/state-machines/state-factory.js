import { ShingleGroup, KeyLengthGroup } from "./groups";
import { DenomSumState, KeyLengthsState, ValidState, KeysState } from "./states";

/**
 * Constructs a state machine. Returns the first state.
 * @param {Object} details 
 */
const constructStateMachine = (details) => {
  const shingleGroups = [];
  const shingles = details.length.shingles;
  for(let i = 0; i < shingles.length; i++) {
    shingleGroups.push(new ShingleGroup(shingles[i]));
  }
  for(let i = 0; i < shingles.length - 1; i++) {
    shingleGroups[i].finalNext = shingleGroups[i + 1];
  }

  const denomSumState = new DenomSumState(details.length.denomSum);
  shingleGroups[shingles.length - 1].finalNext = denomSumState;

  const keyLengthsState = new KeyLengthsState(details.length.keyLengths);
  denomSumState.next = keyLengthsState;

  const keyLengthGroups = [];
  const lengths = details.key.lengths;
  for(let i = 0; i < lengths.length; i++) {
    keyLengthGroups.push(new KeyLengthGroup(lengths[i]));
  }
  keyLengthsState.next = keyLengthGroups[0];
  for(let i = 0; i < lengths.length - 1; i++) {
    keyLengthGroups[i].finalNext = keyLengthGroups[i + 1];
  }

  const keysState = new KeysState(details.key.keys);
  keyLengthGroups[keyLengthGroups.length - 1].finalNext = keysState;

  return shingleGroups[0];
};

export default constructStateMachine;
