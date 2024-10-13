function calculateDiagonalSubstract(matrix) {
  const size = matrix.length;
  let mainSum = 0;
  let secondarySum = 0;

  //   Melakukan perulangan setiap matrix dimana panjangnya 3
  for (let i = 0; i < size; i++) {
    // Melakukan perulangan setiap array dalam matrix
    for (let j = 0; j < matrix[i].length; j++) {
      // Mencari tahu apabila index matrix sama dengan index array dalam matrix maka jumlahkan
      /**Contoh Matrix ke 0 sama dengan array matrix 0 maka menampilkan 1, jika matrix ke 1 harus sama dengan array matrix 1
       * untuk menampilkan 5 ,dst
       */
      if (j === i) {
        mainSum += matrix[i][j];
      }
      //   Mencari tahu apabila index matrix ditambah index array dalam matrix harus sama dengan panjang matrix dikurangi 1
      /** Contoh apabila index matrix ke 0 harus ditambah dengan index array matrix ke 2
       * untuk memenuhi kondisi sama dengan panjang matrix dikurangi 1, maka akan mendaptkan angka 0, dst
       */
      if (i + j === size - 1) {
        secondarySum += matrix[i][j];
      }
    }
  }
  console.log("Hasilnya " + mainSum + " - " + secondarySum + " = " + (mainSum - secondarySum));
}

const Matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];

calculateDiagonalSubstract(Matrix);
