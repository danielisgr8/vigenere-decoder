import { getLetterFrequencies, getLikelyKeys, everyIthChar } from "./key_util";
import { formatCiphertext } from "../util";
import encode from "../encode";

describe("everyIthChar", () => {
  test("simple", () => {
    const str = "abc".repeat(10);
    const groupLength = 3;
    for(let i = 0; i < groupLength; i++) {
      const res = everyIthChar(str, groupLength, i);
      expect(res).toEqual(str[i].repeat(10));
    }
  });
});

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
  test("lab 2 ciphertext", () => {
    const ciphertext = "MSKTEBJVWTMABZLFJOUCMYQNOVTEJQGXLRARVZNWHJDTUXEUSECNZMYDXSCNIGARCZODRYZHZNQFXPSROVTLSOZZQZWDXAYBUGWROTOZWOCCTQYDSWZZPRUPWROVTGCSRYMVDWHKGZHHEVOYBBOYBUCQTGEHGICGDZCYKNBGEZUUARCTQQUNSLSSYAVQSJGNUMFHWSGYMYGFWYKXHDWAKUNSGQAEQVRWDXGISTWEPGISPGXSUTJRXZFKCMPJLQQRWFWJCAXJYMPGKBMEQMCJEKHLQCUZTBGDSEUCEWAZGEQAYDCIUWYGMSEOVTWGSXEZHDPRKKXJSJRUCVVFJCAXPRSCHEUCEWMIXTQAYJSGXVVFRTUXBUWDCSKABEPPUJGGGESRRGBMEVGZTVXPOOTBCSDGOTOLGFPEOUGJJWTMBBLPZREWHAEKORTVXJCAJWALPJKTBEQJCARTTWEPEONLGFRUTTLUFHRUWFWQCUZTBGDSQOKXGQTZNMFMYRGEAUGPGUUPJZPSSGZVWDVGQMVLDVGQMVLQCXSMJZZONSQYGNCSKWAUZAKUVYWEGMUTBKPMUAZODFSYKDRJJPUJGPMETUUBYGZGKEWHYZHZUBHJYAKGZBMYRGTLCMEMUAZSWPHUTBUWRFUAVQYZHZGBNCPHNKPBDOCLGTYAXHAXVVFRZUUARXZCZRWBKPYOISBXQHNKAHFOOEYPBWDDRKIFWWCAOARHFZRSMBXQCLSGXFPSYPIPCRSZHIPCNCSKWATPTUXMJWNFGISYGDSEUCETWIKYMIWCMHULLUFHLUWGDZCYKNBGEZUUARCTQQUNSLSSYAVQSJGNUMFHWSGYMYGFWYKXHDWAKUNSGQAEQVRWDXGISTWEPGISPGXSUTJRXZFKCMPJLQQRWFWJCAXJYMPGKBMEQMCJEKHLPJKXGOGOMIABRNPFEHWQQNIZKDRJJPUJGPMESBKZLTZREICGWGSXEJBVJQAZMIWCMHULLWGSXEJBVJQAZNBGEZUUAR";
    console.log(getLikelyKeys(ciphertext, 7, 75));
  });

  test("manual test", () => {
    const plaintext = "[Verse 1]I'll keep the pictures saved in a safe placeWow, I look so weird hereMy face has changed nowIt's a big shameSo many feelings, struggling to leave my mouthAnd it's not that rare for me to let myself downIn a big wayBut I had enough time and I found enough reason to accept that[Chorus]It's not the same anymoreI lost the joy in my faceMy life was simple beforeI should be happy, of courseBut things just got much harderNow it's just hard to ignoreIt's not the same anymoreIt's not the same anymoreIt's not the same, but it's not a shame 'cause[Verse 2]I spend a long time putting up with peoplePutting on my best faceIt's only normal when you stop things in the wrong wayIt's only four o'clock and still, it's been a long dayI just wanna hit the hayPeople knocking on me like every dayI'm tired of taking stressIf only there could be another wayI'm tired of feeling suppressedAnd when they want me the mostI'm tired of acting like I care, but I doAnd I can't wait to hit the bedBut tomorrow makes me scared[Chorus]'Cause it's not the same anymoreI lost the joy in my faceMy life was simple beforeI should be happy, of course (Of course)But things just got much harderNow it's just hard to ignoreIt's not the same anymore (It's not the same)(It's not the same)(It's not the same)It's not the same anymore (It's not the same)(It's not the same)(It's not the same)[Post-Chorus]Oh-oh(It's not the same)(It's not the same)(It's not the same)Oh-oh[Verse 3]I kept the feelings insideI open up when shit gets built up this highShe makes it easy to cryThe words fall out of me and there's no more disguiseI miss the days when I was someone elseI used to be so hungryRight now, my stomach's full as hellAnd I've spent many months just hating on myselfI can't keep wishing things will be differentOr leaving problems on the shelfI wish I didn't need to get helpBut I doBut I doOh-oh-oh[Verse 4]I been so hard on myself, yeahEven my family can tellAnd they barely saw what I feltI wouldn't wish this on my enemy or anyone else[Chorus]It's not the same(It's not the same)(It's not the same)It's not the same as beforeIt's not the same anymoreAnd it's fine because[Verse 5]I've learned so much from beforeNow I'm not short on adviceThere's no excuses at allNo point in feeling upsetWon't take my place on the floorI'll stand up straight like I'm tallIt's up to me, no one elseI'm doing this for myselfIt's not the same anymoreIt's betterIt got betterIt's not the same anymoreIt's betterYeah, yeah[Outro]Oh-ohOh-oh-oh-oh";
    const key = "orange";
    let ciphertext = encode(plaintext, key);
    ciphertext = formatCiphertext(ciphertext);
    console.log(getLikelyKeys(ciphertext, key.length));
  });
});
