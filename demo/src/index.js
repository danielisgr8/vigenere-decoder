import decode from "../../src/decode";
import encode from "../../src/encode";
import constructStateMachine from "../../src/state-machines/state-factory";

const updateForm = (direction) => {
  form.elements["cipher_key"].disabled = direction === "decode" ? true : false;
}

const form = document.querySelector("form");
const detailsTitle = document.getElementById("details_title");
const detailsBody = document.getElementById("details_body");
const nextButton = document.getElementById("next_state");

let direction = form.elements["cipher_direction"].value;
updateForm(direction);

form.onsubmit = (e) => {
  e.preventDefault();
  if(direction === "decode") {
    const ciphertext = form.elements["cipher_input"].value;
    if(form.elements["cipher_step"].checked) {
      const details = {};
      decode(ciphertext, details);
      let state = constructStateMachine(details);
      detailsTitle.textContent = state.title;
      detailsBody.value = state.body;
      nextButton.onclick = () => {
        let nextState = state.getNext();
        if(nextState) {
          state = nextState;
          detailsTitle.textContent = state.title;
          detailsBody.value = state.body;
        }
      }
    } else {
      const keys = decode(ciphertext);
      detailsBody.value = JSON.stringify(keys);
    }
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
