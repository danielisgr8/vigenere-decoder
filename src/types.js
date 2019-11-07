/**
 * @typedef DecodeGuess
 * @type {Object}
 * @property {string}               plaintext         The potential plaintext
 * @property {number}               keyLength         The key length of this guess
 * @property {string}               key               The key used for this guess
 * @property {Array[Array[number]]} letterFrequencies `keyLength`-length array. Index i gives the letter frequency of every i-th character in the ciphertext. So, each inner array is of length 26 (index 0: a, index 1: b, ..., index 25: z).
 */

/**
 * @typedef MostCommonDenominator
 * @type {Object}
 * @property {number} denom The most common denominator (weighted)
 * @property {number} avg   The weighted sum of the denominator
 */
