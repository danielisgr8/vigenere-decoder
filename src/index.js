import { formatCiphertext } from "./util";
import { getKeyLength } from "./decode";
import "./types";

/**
 * Attempts to automatically decode Vigenère-encoded ciphertext.
 * 
 * It is assumed that all non-alphabetic characters were ignored when producing the ciphertext.
 * @param {string} ciphertext Ciphertext to attempt to decipher
 * @param {number} shingleMin Minimum shingle size when finding key length
 * @param {number} shingleMax Maximum shingle size when finding key length
 * @returns {Array[DecodeGuess]} All likely plaintext configurations
 */
const decode = (ciphertext, shingleMin, shingleMax) => {
  shingleMin = (!shingleMin || shingleMin < 1)                 ? 2 : shingleMin;
  shingleMax = (!shingleMax || shingleMax > ciphertext.length) ? 5 : shingleMax;

  ciphertext = formatCiphertext(ciphertext);

  const keyLength = getKeyLength(ciphertext, shingleMin, shingleMax)[0];
}

export { decode };
