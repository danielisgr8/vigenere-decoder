/**
 * Formats the ciphertext to be used with the rest of the decoding helper functions.
 * @param {string} ciphertext 
 * @returns {string}
 */
const formatCiphertext = (ciphertext) =>
  ciphertext.toUpperCase().split("").filter((char) => "A" >= char && char <= "Z").join("");

export { formatCiphertext };
