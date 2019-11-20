import { getKeyLengths } from "./key_length_util";
import { getLikelyKeys } from "./key_util";
import { simpleCodesToChars, getKeyPermutations, formatCiphertext } from "../util";

/**
 * Attempts to decode the given ciphertext by giving
 *  possible keys.
 * @param {String} ciphertext 
 * @return {Array<String>}
 */
const decode = (ciphertext) => {
  ciphertext = formatCiphertext(ciphertext);
  const keyLengths = getKeyLengths(ciphertext);
  //console.log(keyLengths);
  const keyOptions = [];
  for(let i = 0; i < keyLengths.length; i++) {
    const keyCodes = getLikelyKeys(ciphertext, keyLengths[i]);
    //console.log(keyCodes);
    const keyChars = keyCodes.map((ithCodes) => simpleCodesToChars(ithCodes));
    const keyPermutations = getKeyPermutations(keyChars);
    keyOptions.push(...keyPermutations);
  }
  return keyOptions;
}

export default decode;
