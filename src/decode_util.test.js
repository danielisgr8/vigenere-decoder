import { getDistances } from "./decode_util";
import { shuffle } from "./util";

const randomUniqueString = (size) => {
  if(size <= 0 || size > 26) return "";
  const charCodes = new Array(26);
  for(let i = 0; i < 26; i++) {
    charCodes[i] = i + 97;
  }
  shuffle(charCodes);
  return String.fromCharCode(...(charCodes.slice(0, size)));
}

describe("getDistances", () => {
  test("repeated random unique strings", () => {
    for(let baseLength = 1; baseLength <= 26; baseLength++) {
      for(let repeatCount = 1; repeatCount <= 10; repeatCount++) {
        const str = randomUniqueString(baseLength).repeat(repeatCount);
        const distances = getDistances(str, baseLength);
        if(repeatCount === 1) expect(Object.keys(distances).length).toBe(0);
        else expect(distances[baseLength]).toBe(baseLength * (repeatCount - 2) + 1);
        /*
          Explanation:
          We expect the first substring of `baseLength` length to match `repeatCount - 1` times.

          Every substring after that (without repeating) will match only `repeatCount - 2` times, as they will get "cut off" early compared to the first substring.
          These substrings occur `baseLength - 1` times, as if you shift over `baseLength`, you will be at the original string

          Therefore, the total number of matches is `(repeatCount - 1) + (baseLength - 1) * (repeatCount - 2)`.
          This simplifies to `baseLength * (repeatCount - 2) + 1`.
        */
      }
    }
  });

  test.todo("manual complicated string");
});