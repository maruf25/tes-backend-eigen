function longest(text) {
  const arrayText = text.split(" ");
  let lengthText = 0;
  let sentence;
  for (let index = 0; index < arrayText.length; index++) {
    if (lengthText < arrayText[index].length) {
      sentence = arrayText[index];
      lengthText = arrayText[index].length;
    }
  }
  console.log(sentence + " : " + lengthText);
}

const sentence = "Saya sangat senang mengerjakan soal algoritma";

longest(sentence);
