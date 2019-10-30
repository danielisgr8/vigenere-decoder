import { getKeyLength } from "./decode_util";

/**
 * @typedef DecodeGuess
 * @type {Object}
 * @property {string}               plaintext         The potential plaintext
 * @property {number}               keyLength         The key length of this guess
 * @property {string}               key               The key used for this guess
 * @property {Array[Array[number]]} letterFrequencies `keyLength`-length array. Index i gives the letter frequency of every i-th character in the ciphertext. So, each inner array is of length 26 (index 0: a, index 1: b, ..., index 25: z).
 */

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
