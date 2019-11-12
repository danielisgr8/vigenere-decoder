import { getDistances, mostCommonDenominator, getKeyLength } from "./key_length_util";
import { randomString, randomUniqueString } from "./util";
import encode from "./encode";

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

describe("mostCommonDenominator", () => {
  const runTest = (distances, expectedDenom, expectedAvg) => {
    const output = mostCommonDenominator(distances);
    expect(output.denom).toBe(expectedDenom);
    expect(output.avg).toBe(expectedAvg);
  }

  test("single distance", () => {
    const distances = {
      7: 5
    };

    runTest(distances, 7, 5);
  });

  test("basic multiple distances", () => {
    const distances = {
      2: 100,
      4: 2,
      6: 3,
      8: 4
    };

    runTest(distances, 2, (100 + 2 + 3 + 4) / 4);
  });

  test("basic multiple distances with prime", () => {
    const distances = {
      2: 100,
      4: 2,
      6: 3,
      7: 1000,
      8: 4
    };

    // case: prime expected to be most common
    runTest(distances, 7, 1000);

    // case: prime not expected to be most common
    distances[2] = 10000;
    runTest(distances, 2, (10000 + 2 + 3 + 4) / 4);
  });

  test("expected isn't highest summed denominator", () => {
    const distances = {
      2: 1,
      4: 1000,
      6: 3,
      7: 10,
      8: 4
    };

    runTest(distances, 4, (1000 + 4) / 2);
  });

  test("only primes", () => {
    const distances = {
      2: 10,
      3: 100,
      5: 1000,
      65537: 10000
    };

    runTest(distances, 65537, 10000);
  });
});

describe("getKeyLength", () => {
  test.skip("automatic tests", () => {
    for(let ptSize = 1000; ptSize < 2000; ptSize++) {
      for(let keySize = 2; keySize < 10; keySize++) {
        const plaintext = randomString(ptSize);
        const key = randomString(keySize);
        const ciphertext = encode(plaintext, key);
        // only one guess given for now, so just get that
        const keyLengthGuess = getKeyLength(ciphertext)[0];
        expect(keyLengthGuess).toBe(keySize);
      }
    }
  });

  test("lab 2 ciphertext", () => {
    const ciphertext = "MSKTEBJVWTMABZLFJOUCMYQNOVTEJQGXLRARVZNWHJDTUXEUSECNZMYDXSCNIGARCZODRYZHZNQFXPSROVTLSOZZQZWDXAYBUGWROTOZWOCCTQYDSWZZPRUPWROVTGCSRYMVDWHKGZHHEVOYBBOYBUCQTGEHGICGDZCYKNBGEZUUARCTQQUNSLSSYAVQSJGNUMFHWSGYMYGFWYKXHDWAKUNSGQAEQVRWDXGISTWEPGISPGXSUTJRXZFKCMPJLQQRWFWJCAXJYMPGKBMEQMCJEKHLQCUZTBGDSEUCEWAZGEQAYDCIUWYGMSEOVTWGSXEZHDPRKKXJSJRUCVVFJCAXPRSCHEUCEWMIXTQAYJSGXVVFRTUXBUWDCSKABEPPUJGGGESRRGBMEVGZTVXPOOTBCSDGOTOLGFPEOUGJJWTMBBLPZREWHAEKORTVXJCAJWALPJKTBEQJCARTTWEPEONLGFRUTTLUFHRUWFWQCUZTBGDSQOKXGQTZNMFMYRGEAUGPGUUPJZPSSGZVWDVGQMVLDVGQMVLQCXSMJZZONSQYGNCSKWAUZAKUVYWEGMUTBKPMUAZODFSYKDRJJPUJGPMETUUBYGZGKEWHYZHZUBHJYAKGZBMYRGTLCMEMUAZSWPHUTBUWRFUAVQYZHZGBNCPHNKPBDOCLGTYAXHAXVVFRZUUARXZCZRWBKPYOISBXQHNKAHFOOEYPBWDDRKIFWWCAOARHFZRSMBXQCLSGXFPSYPIPCRSZHIPCNCSKWATPTUXMJWNFGISYGDSEUCETWIKYMIWCMHULLUFHLUWGDZCYKNBGEZUUARCTQQUNSLSSYAVQSJGNUMFHWSGYMYGFWYKXHDWAKUNSGQAEQVRWDXGISTWEPGISPGXSUTJRXZFKCMPJLQQRWFWJCAXJYMPGKBMEQMCJEKHLPJKXGOGOMIABRNPFEHWQQNIZKDRJJPUJGPMESBKZLTZREICGWGSXEJBVJQAZMIWCMHULLWGSXEJBVJQAZNBGEZUUAR";
    console.log(getKeyLength(ciphertext)[0]);
  });
});
