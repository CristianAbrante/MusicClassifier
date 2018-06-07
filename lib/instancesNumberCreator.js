
let csv = require('csv-parser');
let fs = require('fs');

let numberOfInstances = 5000;
let selectedGenres = ["Jazz", "Hip-Hop", "Metal"];
let genres = new Map();

fs.createReadStream('data/lyrics.csv')
  .pipe(csv())
  .on('data', function (data) {
    let genre = data.genre;
    if (isACorrectLyric(data.lyrics) && isASelectedGenre(genre)) {
      if (genres.has(genre)) {
        genres.set(genre, genres.get(genre) + 1);
      } else {
        genres.set(genre, 1);
      }
    }
  })
  .on('end', function () {
    let obj = {numberOfInstances: numberOfInstances, genres: []}
    for (const [key, value] of genres.entries()) {
      obj.genres.push({name: key, instances: value});
    }

    let objStr = JSON.stringify(obj);
    console.log(objStr);
    fs.writeFileSync("data/config.json", objStr);

    console.log("finished");
  });

function isACorrectLyric(lyric) {
  return (lyric !== "" &&  !(/[\[(]?instrumental[\])]?/gi.test(lyric)));
}

function isASelectedGenre(genre) {
  let found = false;
  let i = 0;
  while (i < selectedGenres.length && !found) {
    if (selectedGenres[i] === genre) {
      found = true;
    }
    i += 1;
  }
  return found;
}

module.exports = isACorrectLyric;