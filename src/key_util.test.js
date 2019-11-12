import { getLetterFrequencies } from "./key_util";

describe("getLetterFrequencies", () => {
  test("simple", () => {
    const str = "ABAAAAABAAAABAAABBAA";
    const frequencies = getLetterFrequencies(str);
    expect(frequencies['A']).toBe(75);
    expect(frequencies['B']).toBe(25);
    for(let i = 67; i <= 90; i++) {
      expect(frequencies[String.fromCharCode(i)]).toBe(0);
    }
  });
});

describe("getLikelyKeys", () => {

});
