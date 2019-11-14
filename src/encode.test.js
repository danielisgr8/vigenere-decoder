import encode from "./encode";

describe("encode", () => {
    test("key same length as plaintext, key all As", () => {
        const plaintext = "XYZ";
        const ciphertext = encode(plaintext, "AAA");
        expect(ciphertext).toEqual(plaintext);
    });

    test("key same length as plaintext", () => {
        const ciphertext = encode("SPAGHETTI", "AZBYCXHIJ");
        expect(ciphertext).toEqual("SOBEJBABR");
    });

    test("mix of upper- and lower-case", () => {
        const ciphertext = encode("SpAgHeTtI", "aZbYcXhIj");
        expect(ciphertext).toEqual("SOBEJBABR");
    });

    test("key shorter than plaintext", () => {
        const ciphertext = encode("willbyers", "azby");
        expect(ciphertext).toEqual("WHMJBXFPS");
    });

    test("key longer than ciphertext", () => {
        const ciphertext = encode("SPAGHETTI", "AZBYCXHIJSSKDJFHSKJDFHKJSDFHKJSDHFKJSDF");
        expect(ciphertext).toEqual("SOBEJBABR");
    });

    test("plaintext has non-alphabetic characters", () => {
        const ciphertext = encode("THE%QUICK BROWN[FOX\tJUMPED OVER/THE LAZY DOG", "azbycx");
        expect(ciphertext).toEqual("TGF%OWFCJ CPQTN[EPV\tLRMOFB QSEQ/UFG IAYZ BQD");
    });
});
