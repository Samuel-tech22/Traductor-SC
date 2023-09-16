// Selecciona elementos del DOM utilizando querySelector y asigna referencias a variables.
const fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchangeIcon = document.querySelector(".exchange"),
  selectTag = document.querySelectorAll("select"),
  icons = document.querySelectorAll(".row i");
  translateBtn = document.querySelector("button");

// Llena los elementos <select> con opciones basadas en datos en el objeto "countries".
selectTag.forEach((tag, id) => {
  for (let country_code in countries) {
    // Selecciona la opción predeterminada para el primer <select> como "es-ES" y para el segundo como "en-GB".
    let selected =
      id == 0
        ? country_code == "es-ES"
          ? "selected"
          : ""
        : country_code == "en-GB"
        ? "selected"
        : "";
    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

// Agrega un event listener al icono de intercambio para cambiar los valores entre los campos de texto y selección.
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value,
    tempLang = selectTag[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

// Agrega un event listener al campo de texto de origen para borrar el campo de destino cuando está vacío.
fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

// Agrega un event listener al botón de traducción para realizar la traducción utilizando la API MyMemory.
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Traduciendo...");
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach((data) => {
        if (data.id === 0) {
          toText.value = data.translation;
        }
      });
      toText.setAttribute("placeholder", "Traducción");
    });
});

// Agrega event listeners a los iconos para copiar y pronunciar el texto.
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value || !toText.value) return;
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      if (target.id == "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});
