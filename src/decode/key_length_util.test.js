import { getDistances, mostCommonDenominator, getKeyLength } from "./key_length_util";
import { formatCiphertext } from "../util";
import { randomString, randomUniqueString } from "../util";
import encode from "../encode";

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
  const runTest = (distances, expectedDenom) => {
    const output = mostCommonDenominator(distances);
    expect(output.some((denom) => denom.denom === expectedDenom)).toBe(true);
  }

  test("single distance", () => {
    const distances = {
      7: 5
    };

    runTest(distances, 7);
  });

  test("basic multiple distances", () => {
    const distances = {
      2: 100,
      4: 2,
      6: 3,
      8: 4
    };

    runTest(distances, 2);
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
    runTest(distances, 7);

    // case: prime not expected to be most common
    distances[2] = 10000;
    runTest(distances, 2);
  });

  test("expected isn't highest summed denominator", () => {
    const distances = {
      2: 1,
      4: 1000,
      //6: 3,
      7: 10,
      8: 4
    };

    runTest(distances, 4);
  });

  test("only primes", () => {
    const distances = {
      2: 10,
      3: 100,
      5: 1000,
      65537: 10000
    };

    runTest(distances, 65537);
  });
});

describe("getKeyLength", () => {
  const randKeyTest = (plaintext, min = 1, max = 15) => {
    for(let i = min; i < max; i++) {
      const key = randomString(i);
      let ciphertext = encode(plaintext, key);
      ciphertext = formatCiphertext(ciphertext);
      //console.log("key length: " + i);
      const denoms = getKeyLength(ciphertext, 2, 6);
      //console.log(denoms);
      // correct denom should be included
      expect(denoms.includes(key.length)).toBe(true);
      // don't want too many false-positives
      expect(denoms.length <= 3).toBe(true);
    }
  }

  test("lab 2 ciphertext", () => {
    const ciphertext = "MSKTEBJVWTMABZLFJOUCMYQNOVTEJQGXLRARVZNWHJDTUXEUSECNZMYDXSCNIGARCZODRYZHZNQFXPSROVTLSOZZQZWDXAYBUGWROTOZWOCCTQYDSWZZPRUPWROVTGCSRYMVDWHKGZHHEVOYBBOYBUCQTGEHGICGDZCYKNBGEZUUARCTQQUNSLSSYAVQSJGNUMFHWSGYMYGFWYKXHDWAKUNSGQAEQVRWDXGISTWEPGISPGXSUTJRXZFKCMPJLQQRWFWJCAXJYMPGKBMEQMCJEKHLQCUZTBGDSEUCEWAZGEQAYDCIUWYGMSEOVTWGSXEZHDPRKKXJSJRUCVVFJCAXPRSCHEUCEWMIXTQAYJSGXVVFRTUXBUWDCSKABEPPUJGGGESRRGBMEVGZTVXPOOTBCSDGOTOLGFPEOUGJJWTMBBLPZREWHAEKORTVXJCAJWALPJKTBEQJCARTTWEPEONLGFRUTTLUFHRUWFWQCUZTBGDSQOKXGQTZNMFMYRGEAUGPGUUPJZPSSGZVWDVGQMVLDVGQMVLQCXSMJZZONSQYGNCSKWAUZAKUVYWEGMUTBKPMUAZODFSYKDRJJPUJGPMETUUBYGZGKEWHYZHZUBHJYAKGZBMYRGTLCMEMUAZSWPHUTBUWRFUAVQYZHZGBNCPHNKPBDOCLGTYAXHAXVVFRZUUARXZCZRWBKPYOISBXQHNKAHFOOEYPBWDDRKIFWWCAOARHFZRSMBXQCLSGXFPSYPIPCRSZHIPCNCSKWATPTUXMJWNFGISYGDSEUCETWIKYMIWCMHULLUFHLUWGDZCYKNBGEZUUARCTQQUNSLSSYAVQSJGNUMFHWSGYMYGFWYKXHDWAKUNSGQAEQVRWDXGISTWEPGISPGXSUTJRXZFKCMPJLQQRWFWJCAXJYMPGKBMEQMCJEKHLPJKXGOGOMIABRNPFEHWQQNIZKDRJJPUJGPMESBKZLTZREICGWGSXEJBVJQAZMIWCMHULLWGSXEJBVJQAZNBGEZUUAR";
    expect(getKeyLength(ciphertext)[0]).toBe(7);
  });

  test("It's Not The Same Anymore - Rex Orange County", () => {
    const plaintext = "[Verse 1]I'll keep the pictures saved in a safe placeWow, I look so weird hereMy face has changed nowIt's a big shameSo many feelings, struggling to leave my mouthAnd it's not that rare for me to let myself downIn a big wayBut I had enough time and I found enough reason to accept that[Chorus]It's not the same anymoreI lost the joy in my faceMy life was simple beforeI should be happy, of courseBut things just got much harderNow it's just hard to ignoreIt's not the same anymoreIt's not the same anymoreIt's not the same, but it's not a shame 'cause[Verse 2]I spend a long time putting up with peoplePutting on my best faceIt's only normal when you stop things in the wrong wayIt's only four o'clock and still, it's been a long dayI just wanna hit the hayPeople knocking on me like every dayI'm tired of taking stressIf only there could be another wayI'm tired of feeling suppressedAnd when they want me the mostI'm tired of acting like I care, but I doAnd I can't wait to hit the bedBut tomorrow makes me scared[Chorus]'Cause it's not the same anymoreI lost the joy in my faceMy life was simple beforeI should be happy, of course (Of course)But things just got much harderNow it's just hard to ignoreIt's not the same anymore (It's not the same)(It's not the same)(It's not the same)It's not the same anymore (It's not the same)(It's not the same)(It's not the same)[Post-Chorus]Oh-oh(It's not the same)(It's not the same)(It's not the same)Oh-oh[Verse 3]I kept the feelings insideI open up when shit gets built up this highShe makes it easy to cryThe words fall out of me and there's no more disguiseI miss the days when I was someone elseI used to be so hungryRight now, my stomach's full as hellAnd I've spent many months just hating on myselfI can't keep wishing things will be differentOr leaving problems on the shelfI wish I didn't need to get helpBut I doBut I doOh-oh-oh[Verse 4]I been so hard on myself, yeahEven my family can tellAnd they barely saw what I feltI wouldn't wish this on my enemy or anyone else[Chorus]It's not the same(It's not the same)(It's not the same)It's not the same as beforeIt's not the same anymoreAnd it's fine because[Verse 5]I've learned so much from beforeNow I'm not short on adviceThere's no excuses at allNo point in feeling upsetWon't take my place on the floorI'll stand up straight like I'm tallIt's up to me, no one elseI'm doing this for myselfIt's not the same anymoreIt's betterIt got betterIt's not the same anymoreIt's betterYeah, yeah[Outro]Oh-ohOh-oh-oh-oh";
    randKeyTest(plaintext);
  });

  test("Excerpt of the Declaration of Independence", () => {
    const plaintext = "The unanimous Declaration of the thirteen united States of America, When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.--That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed, --That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness. Prudence, indeed, will dictate that Governments long established should not be changed for light and transient causes; and accordingly all experience hath shewn, that mankind are more disposed to suffer, while evils are sufferable, than to right themselves by abolishing the forms to which they are accustomed. But when a long train of abuses and usurpations, pursuing invariably the same Object evinces a design to reduce them under absolute Despotism, it is their right, it is their duty, to throw off such Government, and to provide new Guards for their future security.--Such has been the patient sufferance of these Colonies; and such is now the necessity which constrains them to alter their former Systems of Government. The history of the present King of Great Britain is a history of repeated injuries and usurpations, all having in direct object the establishment of an absolute Tyranny over these States. To prove this, let Facts be submitted to a candid world.";
    randKeyTest(plaintext);
  });
});
