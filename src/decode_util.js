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
  const sortedKeys = Object.keys(distances).sort();
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
 * @param {string} ciphertext 
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

export { getKeyLength, mostCommonDenominator, getDistances };
