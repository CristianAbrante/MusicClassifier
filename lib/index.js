let csv = require('csv-parser');
let fs = require('fs');
let config = JSON.parse(fs.readFileSync('data/config.json', 'utf8'));
let isACorrectLyric = require('./instancesNumberCreator')

const inputFile = 'data/lyrics.csv';
const outputFile = 'data/processed-lyrics.csv';

let numberOfInstances = config.numberOfInstances;
let totalInstances = 0;
let instancesByGenre = (numberOfInstances / config.genres.length);
let genres = new Map();
let intervals = new Map();
let selected = [];

config.genres.forEach(function(genre) {
  totalInstances += genre.instances;
})

console.log(totalInstances);
console.log(instancesByGenre);

config.genres.forEach(function(genre) {
  intervals.set(genre.name, Math.round(genre.instances / instancesByGenre));
});

console.log(intervals);


fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', function (data) {
    let genre = data.genre;
    if (intervals.get(genre) !== undefined
        && intervals.get(genre) < instancesByGenre
        && isACorrectLyric(data.lyrics)) {
      if (genres.has(genre)) {
        genres.set(genre, genres.get(genre) + 1);
      } else {
        genres.set(genre, 1);
      }
      // If interval is correct
      if ((genres.get(genre) % intervals.get(genre)) === 0){
        addToSelected(data);
      }
    }
  })
  .on('end', function () {
    exportToCSV();
    console.log("finished");
  });

function addToSelected(song) {
  let lyrics = song.lyrics.replace(/(?:\r\n|\r|\n|,)/g, ' ');
  selected.push([song.genre, lyrics]);
}

function exportToCSV() {
  fs.writeFileSync(outputFile, "genre, lyrics\n");
  selected.forEach(function(item) {
    fs.appendFileSync('data/processed-lyrics.csv', item[0] + ", \"" + item[1] + "\"" + '\n');
  })
}

