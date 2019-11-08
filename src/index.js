import { getKeyLength } from "./decode_util";
import "./types";

/**
 * Attempts to automatically decode Vigenère-encoded ciphertext.
 * @param {string} ciphertext Ciphertext to attempt to decipher
 * @param {number} shingleMin Minimum shingle size when finding key length
 * @param {number} shingleMax Maximum shingle size when finding key length
 * @returns {Array[DecodeGuess]} All likely plaintext configurations
 */
const decode = (ciphertext, shingleMin, shingleMax) => {
  shingleMin = (!shingleMin || shingleMin < 1)                 ? 2 : shingleMin;
  shingleMax = (!shingleMax || shingleMax > ciphertext.length) ? 5 : shingleMax;

  const keyLength = getKeyLength(ciphertext, shingleMin, shingleMax)[0];
}

export { decode };
