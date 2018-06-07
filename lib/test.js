
let csv = require('csv-parser');
let fs = require('fs');

let numberOfInstances = 5000;
let selectedGenres = ["Pop", "Hip-Hop", "Rock", "Metal"];

let genres = new Map();
let lines = 0;
fs.createReadStream('data/processed-lyrics.csv')
  .pipe(csv())
  .on('data', function (data) {
    let genre = data.genre;
    lines += 1;
    if (genres.has(genre)) {
      genres.set(genre, genres.get(genre) + 1);
    } else {
      genres.set(genre, 1);
    }
  })
  .on('end', function () {
    console.log(lines);
    console.log(genres);
  });