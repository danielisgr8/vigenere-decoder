import PolynomialHash from "./PolynomialHash";
import "./types";

const rollingHash = new PolynomialHash();
 
/**
* Calculates distances between all matching shingles of size `shingleSize` in `text`.
* Returns a hash table that maps distances to their respective frequencies.
* Distance is calculated as start index of current match minus start index of last match.
* @param {string} text 
* @param {number} shingleSize 
* @returns {object}
*/
const getDistances = (text, shingleSize) => {
  const distances = {};
  // tracks which shingles have already been tested and can be skipped
  const shinglesTested = {};
  // shingles cannot overlap, so the last possible match would be the last 2 * shingleSize characters of `ciphertext`
  for(let matchIndex = 0; matchIndex <= text.length - 2 * shingleSize; matchIndex++) {
    // the shingle we are attempting to match with this iteration
    const matchStr = text.substring(matchIndex, matchIndex + shingleSize);

    // if we've seen it before, it's already been counted in `distances`; skip it
    if(shinglesTested[matchStr]) continue;
    else shinglesTested[matchStr] = true;

    // use rolling hashing to find distances between matches of `matchStr`
    const matchHash = rollingHash.hash(matchStr);
    let lastStr = null, lastHash = null, lastMatchIndex = matchIndex;
    for(let strIndex = matchIndex + shingleSize; strIndex <= text.length - shingleSize; strIndex++) {
      const currentStr = text.substring(strIndex, strIndex + shingleSize)
      let currentHash;

      if(!lastStr) {
        lastStr = matchStr;
        lastHash = matchHash;
        currentHash = rollingHash.hash(currentStr);
      } else {
        currentHash = rollingHash.roll(lastHash, lastStr, currentStr);
      }

      // hash can have collisions, so we must also check for equality
      if(matchHash === currentHash &&
         currentStr === matchStr) {
        const distance = strIndex - lastMatchIndex;
        if(!distances[distance]) distances[distance] = 0;
        distances[distance]++;
        lastMatchIndex = strIndex;
      }

      lastStr = currentStr;
      lastHash = currentHash;
    }
  }

  return distances;
}

/**
 * Finds the most common denominator, which is defined below:
 * 
 *  For some number `n`, let `A_n` be all multiples of `n` in `distances`.
 *  Let `s_n` be the sum of `distances[a]` for all `a` in `A_n`.
 *  Let `average_n` be `s_n / |A_n|`.
 * 
 *  Let the most common denominator be the maximum value in `{ average_n | n` is a key of `distances }`
 * 
 * @param {object} distances Hash table of distance frequencies, as returned in `getDistances`
 * @returns {MostCommonDenominator} The most common denominator (weighted)
 */
const mostCommonDenominator = (distances) => {
  // keys must be converted to numbers before being sorted because keys are always strings
  const sortedKeys = Object.keys(distances).map((key) => Number(key)).sort((a, b) => a - b);
  // maps keys from `sortedKeys` to an object storing the current sum of occurrences from multiples (sum)
  //  and how many multiples have been encountered (count)
  const values = {};

  for(let currentIndex = sortedKeys.length - 1; currentIndex >= 0; currentIndex--) {
    const current = sortedKeys[currentIndex];

    if(!values[current]) values[current] = { sum: 0, count: 0 };
    values[current].sum += distances[current];
    values[current].count++;

    /*
      Attempt to find the largest denominator of `current`.
      If found, update its sum and count.

      By only finding the largest denominator, sums will "avalanche" down.
      For a given `current`, `values[current].sum` at this point will always be
        the sum of it and all its multiples' frequencies.
      Therefore, the sum of frequencies of the largest denominator of `current` is simply
        `values[current].sum` plus the largest denominator's frequency (which is added at the
        beginning of its iteration of the for loop).
    */
    for(let nextIndex = currentIndex - 1; nextIndex >= 0; nextIndex--) {
      const next = sortedKeys[nextIndex];

      if(current % next === 0) {
        if(!values[next]) values[next] = { sum: 0, count: 0 };
        values[next].sum += values[current].sum;
        values[next].count += values[current].count;

        break;
      }
    }
  }

  // now find the best weighted denominator, where a weighted denominator is
  //  its `sum` divided by its `count`
  const bestWeighted = { denom: 0, avg: 0 }
  sortedKeys.forEach((key) => {
    const avg = values[key].sum / values[key].count;
    if(avg > bestWeighted.avg) {
      bestWeighted.denom = Number(key);
      bestWeighted.avg = avg;
    }
  });

  return bestWeighted;
}

/**
 * Attempts to automatically get the key length of the Vigenère configuration from the ciphertext.
 * Currently, returns an array with a single element: the most likely key size.
 * In the future, it may return multiple items.
 * @param {string} ciphertext A ciphertext string of only alphabetic characters
 * @param {number} shingleMin 
 * @param {string} shingleMax 
 * @returns {Array[number]} An array of likely key sizes
 */
const getKeyLength = (ciphertext, shingleMin, shingleMax) => {
  // TODO: in the future, allow returning multiple possible key lengths
  // TODO: use previous distances to help find matches in future `getDistances` calls (future distances are "subsets" of past distances)
  /** @type {MostCommonDenominator} */
  let bestDenom = { denom: 0, avg: 0 };
  for(let shingleSize = shingleMin; shingleSize <= shingleMax; shingleSize++) {
    const distances = getDistances(ciphertext, shingleSize);
    let denom = mostCommonDenominator(distances);
    if(denom.avg > bestDenom.avg) bestDenom = denom;
  }
  return [bestDenom.denom];
}

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
const getLikelyKeys = (ciphertext, keyLength, threshold) => {
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
        diffSum += Math.abs(strFrequencies[originalChar] - englishFrequencies[mappedChar]);
      }

      if(diffSum <= threshold) possibleShifts[keyI].push(shift);
    }
  }
}

/**
 * Formats the ciphertext to be used with the rest of the decoding helper functions.
 * @param {string} ciphertext 
 * @returns {string}
 */
const formatCiphertext = (ciphertext) =>
  ciphertext.toUpperCase().split("").filter((char) => "A" >= char && char <= "Z").join("");

export { getKeyLength, mostCommonDenominator, getDistances, formatCiphertext };
