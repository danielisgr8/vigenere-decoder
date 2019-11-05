import { getDistances } from "./decode_util";
import { shuffle } from "./util";

const randomUniqueString = (size) => {
  if(size <= 0 || size > 26) return "";
  const charCodes = new Array(26);
  for(let i = 0; i < 26; i++) {
    charCodes[i] = i + 97;
  }
  shuffle(charCodes);
  //console.log(charCodes);
  return String.fromCharCode(...(charCodes.slice(0, size)));
}

describe("getDistances", () => {
  test("base", () => {
    for(let baseLength = 1; baseLength <= 26; baseLength++) {
      for(let repeatCount = 1; repeatCount <= 10; repeatCount++) {
        const str = randomUniqueString(baseLength).repeat(repeatCount);
        if(repeatCount === 1) expect(Object.keys(getDistances(str)).length).toBe(0);
        else expect(getDistances(str)[baseLength]).toBe(repeatCount - 1);
      }
    }
  });
});