import { getKeyLengths } from "./key_length_util";
import { getLikelyKeys } from "./key_util";
import { simpleCodesToChars, getKeyPermutations, formatCiphertext } from "../util";

/**
 * Attempts to decode the given ciphertext by giving
 *  possible keys.
 * @param {String} ciphertext 
 * @param {Object} details An empty object to be filled with step-by-step data
 * @return {Array<String>}
 */
const decode = (ciphertext, details = {}) => {
  ciphertext = formatCiphertext(ciphertext);
  details.length = {};
  const keyLengths = getKeyLengths(ciphertext, details.length);
  //console.log(keyLengths);

  details.key = { lengths: [] };
  const keyOptions = [];
  for(let i = 0; i < keyLengths.length; i++) {
    details.key.lengths[i] = {};
    const keyCodes = getLikelyKeys(ciphertext, keyLengths[i], details.key.lengths[i]);
    //console.log(keyCodes);
    const keyChars = keyCodes.map((ithCodes) => simpleCodesToChars(ithCodes));
    const keyPermutations = getKeyPermutations(keyChars);
    keyOptions.push(...keyPermutations);
  }
  details.key.keys = keyOptions;
  return keyOptions;
}

export default decode;
