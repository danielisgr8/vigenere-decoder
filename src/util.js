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
 * Formats the ciphertext to be used with the rest of the decoding helper functions.
 * @param {string} ciphertext 
 * @returns {string}
 */
const formatCiphertext = (ciphertext) =>
  ciphertext.toUpperCase().split("").filter((char) => "A" <= char && char <= "Z").join("");

export { shuffle, randomString, randomUniqueString, formatCiphertext };
