import PolynomialHash from "./PolynomialHash";
import "../types";

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

  //console.log(distances);

  return distances;
}

/**
 * Finds the best weighted denominators.
 * This includes the best denominator and denominators whose scores
 *  differ by less than 25 percent of the best's score.
 * 
 * @param {object} distances Hash table of distance frequencies, as returned in `getDistances`
 * @returns {Array<MostCommonDenominator>} The most likely denominators
 */
const mostCommonDenominator = (distances) => {
  // keys must be converted to numbers before being sorted because keys are always strings
  const sortedKeys = Object.keys(distances).map((key) => Number(key)).sort((a, b) => a - b);

  const maxKey = sortedKeys[sortedKeys.length - 1];
  const bestDenom = { denom: 0, avg: 0 };
  const denoms = {};
  for(let i = 1; i <= maxKey; i++) {
    let multipleCount = 0;
    let geqCount = 0;
    const baseAvg = sortedKeys.reduce((accumulator, currentKey) => {
      if(currentKey < i) return accumulator;
      geqCount++;
      if(currentKey % i !== 0) return accumulator;
      multipleCount++;
      return accumulator + distances[currentKey];
    }, 0);
    const lowNumberPenalty = 4.5 - 4 / Math.pow(i, 1 / 2);
    const flukePenalty = multipleCount / geqCount;
    const avg = (0.7 * lowNumberPenalty + 0.3 * flukePenalty) * baseAvg;

    denoms[i] = avg;

    if(avg > bestDenom.avg) {
      bestDenom.denom = i;
      bestDenom.avg = avg;
    }
  }

  const likelyDenoms = [bestDenom];
  const avgMin = bestDenom.avg * 0.75;
  for(let i = 1; i <= maxKey; i++) {
    if(i !== bestDenom.denom && denoms[i] >= avgMin) {
      likelyDenoms.push({ denom: i, avg: denoms[i] });
    }
  }

  return likelyDenoms;
}

/**
 * Attempts to automatically get the key length of the Vigenère configuration from the ciphertext.
 * 
 * Returns an array of likely key sizes. Each key size is a given a likelihood score.
 * A likely key is the size with the highest score as well as any sizes that differ
 *  from the most likely score by less than 75 percent.
 * @param {string} ciphertext A ciphertext string of only alphabetic characters
 * @param {Object} details An empty object to fill with step-by-step details
 * @param {number} shingleMin 
 * @param {string} shingleMax 
 * @returns {Array[number]} An array of likely key sizes
 */
const getKeyLengths = (ciphertext, details = {}, shingleMin = 2, shingleMax = 5) => {
  // TODO: use previous distances to help find matches in future `getDistances` calls (future distances are "subsets" of past distances)
  /** @type {MostCommonDenominator} */
  const denomResults = {};
  const bestDenom = { denom: -1, avg: 0 };
  details.shingles = [];
  for(let shingleSize = shingleMin; shingleSize <= shingleMax; shingleSize++) {
    //console.log(`Shingle length: ${shingleSize}`);
    const distances = getDistances(ciphertext, shingleSize);
    const denoms = mostCommonDenominator(distances);
    for(let i = 0; i < denoms.length; i++) {
      const denom = denoms[i];
      if(!denomResults[denom.denom]) denomResults[denom.denom] = 0;
      denomResults[denom.denom] += denom.avg;
    }

    const shingleDetails = {
      size: shingleSize,
      distances,
      denoms
    };
    details.shingles.push(shingleDetails);
  }
  details.denomSum = denomResults;
  //console.log(denomResults);

  // find best key
  Object.keys(denomResults).forEach((key) => {
    if(denomResults[key] > bestDenom.avg) {
      bestDenom.denom = Number(key);
      bestDenom.avg = denomResults[key];
    }
  });

  // find keys less than 75 percent different
  const res = [bestDenom];
  const avgMin = bestDenom.avg * 0.75;
  Object.keys(denomResults).forEach((key) => {
    if(Number(key) !== res[0].denom && denomResults[key] >= avgMin) {
      res.push({ denom: Number(key), avg: denomResults[key] });
    }
  });
  const resDenoms = res.map((denom) => denom.denom);
  details.keyLengths = resDenoms;
  return resDenoms;
}

export { getKeyLengths, mostCommonDenominator, getDistances };