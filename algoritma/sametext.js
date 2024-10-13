function sametext(input, query) {
  let output = [];
  for (let index = 0; index < query.length; index++) {
    const text = query[index];
    // Melakukan filter untuk mencari kata yang sama antara input dan query
    const match = input.filter((item) => item === text);
    // Masukkan panjang kata yang sama kedalam array output
    output.push(match.length);
  }
  console.log("OUTPUT = " + "[" + output + "]");
  console.log(output);
}

const INPUT = ["xc", "dz", "bbb", "dz"];
const QUERY = ["bbb", "ac", "dz"];

sametext(INPUT, QUERY);
