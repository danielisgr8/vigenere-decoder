/**
 * Creates groups of the given size from the given string.
 * Returns a string that contains the i-th character of each group.
 * @param {string} str 
 * @param {number} groupLength 
 * @param {number} i 
 * @returns {string}
 */
const everyIthChar = (str, groupLength, i) =>
  str.split("").filter((_char, j) => j % groupLength === i).join("");

/**
 * Calculates the frequency of each letter in the given string.
 * Non-alphabetic characters are ignored when calculating proportions.
 * Frequencies are represented as percentages, i.e., if a given character
 *  represents 10% of the valid characters in the string, its value will be 10.
 * @param {string} str A string containing only upper-case alphabetic characters
 * @returns {object} A mapping of character ('A', 'B', etc.) to its respective frequency, or `null` if an non-alphabetic character is encountered
 */
const getLetterFrequencies = (str) => {
  const charFrequencies = {};
  for(let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if(charCode < 65 || charCode > 90) return null;
    if(!charFrequencies[str[i]]) charFrequencies[str[i]] = 0;
    charFrequencies[str[i]]++;
  }

  for(let i = 65; i <= 90; i++) {
    const char = String.fromCharCode(i);
    if(charFrequencies[char]) {
      charFrequencies[char] = charFrequencies[char] / str.length * 100;
    } else {
      charFrequencies[char] = 0;
    }
  }

  return charFrequencies;
}

/**
 * Finds the most likely keys for the given ciphertext and key length.
 * Likeliness is calculated through letter frequency analysis.
 * @param {string} ciphertext Ciphertext containing only upper-case alphabetic characters
 * @param {number} keyLength 
 * @param {number} threshold The amount a shift's frequency can differ from standard English frequency and still be a likely shift
 */
const getLikelyKeys = (ciphertext, keyLength, threshold = 75) => {
  const englishFrequencies = {
    'E': 12.02,
    'T':  9.1 ,
    'A':  8.12,
    'O':  7.68,
    'I':  7.31,
    'N':  6.95,
    'S':  6.28,
    'R':  6.02,
    'H':  5.92,
    'D':  4.32,
    'L':  3.98,
    'U':  2.88,
    'C':  2.71,
    'M':  2.61,
    'F':  2.3 ,
    'Y':  2.11,
    'W':  2.09,
    'G':  2.03,
    'P':  1.82,
    'B':  1.49,
    'V':  1.11,
    'K':  0.69,
    'X':  0.17,
    'Q':  0.11,
    'J':  0.10,
    'Z':  0.07
  };

  const possibleShifts = new Array(keyLength);
  for(let i = 0; i < keyLength; i++) {
    possibleShifts[i] = [];
  }

  for(let keyI = 0; keyI < keyLength; keyI++) {
    const str = everyIthChar(ciphertext, keyLength, keyI);
    const strFrequencies = getLetterFrequencies(str);

    for(let shift = 0; shift < 26; shift++) {
      let diffSum = 0;

      for(let charCode = 0; charCode < 26; charCode++) {
        const originalChar = String.fromCharCode(65 + charCode);
        const mappedChar = String.fromCharCode(65 + ((charCode + shift) % 26));
        diffSum += Math.abs(englishFrequencies[originalChar] - strFrequencies[mappedChar]);
      }

      if(diffSum <= threshold) possibleShifts[keyI].push(shift);
    }
  }

  return possibleShifts;
}

export { getLetterFrequencies, getLikelyKeys, everyIthChar };