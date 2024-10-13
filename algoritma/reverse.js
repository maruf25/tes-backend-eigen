function reverseText(text) {
  const regex = /([a-zA-Z]+)(\d+)/;

  //   Memisahkan antara text dan angka
  const getText = text.match(regex);

  // Melakukan split setiap huruf pada text kemudian lakukan reverse dan disambungkan kembali
  const reverse = getText[1].split("").reverse().join("");

  console.log(reverse + getText[2]);
}

const text = "EIGEN1";

reverseText(text);
