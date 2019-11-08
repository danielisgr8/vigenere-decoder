/**
 * Enocdes the given plaintext with the given key using the Vigenère cipher.
 * The resulting ciphertext will always be in upper-case, however, `plaintext` and `key` can be any case.
 * Any non-alphabetic characters in `plaintext` are ignored.
 * If a non-alphabetic character is encountered in `key`, `plaintext.toUpperCase()` will be returned.
 * @param {string} plaintext 
 * @param {string} key 
 * @returns {string}
 */
const encode = (plaintext, key) => {
    plaintext = plaintext.toUpperCase();
    key = key.toUpperCase();

    const charCodes = new Array(plaintext.length);
    // key should only apply to valid character
    let alphCount = 0;
    for(let i = 0; i < plaintext.length; i++) {
        const ptCode = plaintext.charCodeAt(i);
        const kCode = key.charCodeAt(alphCount % key.length);

        if(kCode < 65 || kCode > 90) return plaintext;

        if(ptCode < 65 || ptCode > 90) charCodes[i] = ptCode;
        else {
            charCodes[i] = (ptCode - 65 + kCode - 65) % 26 + 65;
            alphCount++;
        }
    }

    return String.fromCharCode(...charCodes);
}

export default encode;
