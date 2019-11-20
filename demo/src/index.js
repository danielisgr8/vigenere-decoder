import decode from "../../src/decode";
import encode from "../../src/encode";

const updateForm = (direction) => {
  form.elements["cipher_key"].disabled = direction === "decode" ? true : false;
}

const form = document.querySelector("form");
const detailsBody = document.getElementById("details_body");

let direction = form.elements["cipher_direction"].value;
updateForm(direction);

form.onsubmit = (e) => {
  e.preventDefault();
  if(direction === "decode") {
    const ciphertext = form.elements["cipher_input"].value;
    const keys = decode(ciphertext);
    detailsBody.value = JSON.stringify(keys);
  } else {
    const plaintext = form.elements["cipher_input"].value;
    const key = form.elements["cipher_key"].value;
    const ciphertext = encode(plaintext, key);
    detailsBody.value = ciphertext;
  }
}

form.onchange = () => {
  if(form.elements["cipher_direction"].value !== direction) {
    direction = form.elements["cipher_direction"].value;
    updateForm(direction);
  }
}
