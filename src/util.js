const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const swap = (arr, i, j) => {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

const shuffle = (arr) => {
  for(let i = arr.length - 1; i >= 1; i--) {
    let j = randInt(0, i + 1);
    swap(arr, i, j);
  }
}

/**
 * Returns a random alphabetic, lower-case string
 * @param {number} size Size of the string
 */
const randomString = (size) => {
  const charCodes = new Array(size);
  for(let i = 0; i < size; i++) {
    charCodes[i] = randInt(0, 26) + 97;
  }
  return String.fromCharCode(...charCodes);
}

/**
 * Returns a random unique, alphabetic, lower-case string.
 * @param {number} size Size of the string. Must be <= 26.
 * @returns {string}
 */
const randomUniqueString = (size) => {
  if(size <= 0 || size > 26) return "";
  const charCodes = new Array(26);
  for(let i = 0; i < 26; i++) {
    charCodes[i] = i + 97;
  }
  shuffle(charCodes);
  return String.fromCharCode(...(charCodes.slice(0, size)));
}

/**
 * Formats the ciphertext to be used when decoding.
 * @param {string} ciphertext 
 * @returns {string}
 */
const formatCiphertext = (ciphertext) =>
  ciphertext.toUpperCase().split("").filter((char) => "A" <= char && char <= "Z").join("");

/**
 * Converts "simple" letter codes to characters.
 * Returns a new array with this conversion.
 * "Simple" codes are A -> 0, B -> 1, ..., Z -> 25.
 */
const simpleCodesToChars = (arr) =>
  arr.map((code) => String.fromCharCode(65 + code));

/**
 * Get all permutations of strings from `keyChars`.
 * The i-th element of `keyChars` is an array of possible characters
 *  at the i-th index of a string.
 * @param {Array<Array<String>>} keyChars 
 * @returns {Array<String>}
 */
const getKeyPermutations = (keyChars) => {
  return keyPermutationsHelper(keyChars, 0);
};

/**
 * @param {Array<Array<String>>} keyChars 
 * @param {number} index Current index of `keyChars` this call is starting at
 * @returns {Array<String>}
 */
const keyPermutationsHelper = (keyChars, index) => {
  if(index === keyChars.length - 1) return keyChars[index];

  const keys = [];
  const subPermutations = keyPermutationsHelper(keyChars, index + 1);
  for(let i = 0; i < keyChars[index].length; i++) {
    const beginningChar = keyChars[index][i];
    for(let j = 0; j < subPermutations.length; j++) {
      keys.push(beginningChar + subPermutations[j]);
    }
  }
  return keys;
};

export { shuffle, randomString, randomUniqueString, formatCiphertext, simpleCodesToChars, getKeyPermutations };
