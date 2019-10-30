import PolynomialHash from "./PolynomialHash";

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
  let distances = {};
  // shingles cannot overlap, so the last possible match would be the last 2 * shingleSize characters of `ciphertext`
  for(let matchIndex = 0; matchIndex <= text.length - 2 * shingleSize; matchIndex++) {
    // the shingle we are attempting to match with this iteration
    const matchStr = text.substring(matchIndex, matchIndex + shingleSize);
    const matchHash = rollingHash.hash(matchStr);

    // use rolling hashing to find distances between matches of `matchStr`
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
 *  Let `average_n` be `s / |A|`.
 * 
 *  Let the most common denominator be the maximum value in `{ average_n | n` is a key of `distances }`
 * 
 * @param {object} distances Hash table of distance frequencies, as returned in `getDistances`
 * @returns {number}
 */
const mostCommonDenominator = (distances) => {

}

/**
 * Attempts to automatically get the key length of the Vigenère configuration from the ciphertext.
 * Currently, returns an array with a single element: the most likely key size.
 * In the future, it may return multiple items.
 * @param {string} ciphertext 
 * @param {number} shingleMin 
 * @param {string} shingleMax 
 * @returns {Array[number]} An array of likely key sizes
 */
const getKeyLength = (ciphertext, shingleMin, shingleMax) => {
  // TODO: in the future, allow returning multiple possible key lengths
  let bestDenom = { value: 0, avg: 0 };
  for(let shingleSize = shingleMin; shingleSize <= shingleMax; shingleSize++) {
    const distances = getDistances(ciphertext, shingleSize);
    // let denom = mostCommonDenominator(distances)
    // if(denom.sum > bestDenom.sum) bestDenom = denom
  }
  return [bestDenom.value];
}

export { getKeyLength, mostCommonDenominator, getDistances };