const fs = require('fs');
const prefixes = fs.readFileSync('./prefixes.txt').toString().split('\r\n');
const endings = fs.readFileSync('./endings.txt').toString().split('\r\n');

module.exports.findSignalWord = function(signalWords, textRaw) {
  const detected = new Map();

  for (const signalWord of signalWords) {
    const text = textRaw.replace(/[\(|\)|\.|,]/g, '').toLowerCase().split(' ');
    if (text.includes(signalWord)) {
      if (detected.has(signalWord)) {
        detected.get(signalWord).push({
          word: signalWord,
          distance: 0,
        });
      } else {
        detected.set(signalWord, {
          word: signalWord,
          distance: 0,
        });
      }
    } else {
      const res = analyze(signalWord, text);
      if (res.length) {
        if (detected.has(signalWord)) {
          detected.get(signalWord).push(...res);
        } else {
          detected.set(signalWord, [...res]);
        }
      }
    }
  }

  return detected;
}
function analyze(signalWord, text) {
  const signalStem = getStem(signalWord);
  const detected = [];

  for (const word of text) {
    if (word.length <= 2) {
      continue
    }

    const stem = getStem(word);

    if (signalStem === stem || getLevenshteinDistance(signalStem, stem) < signalStem.length / 2) {
      detected.push({
        word: word,
        distance: getLevenshteinDistance(signalStem, stem),
      });
    }
  }

  return detected;
}
function getStem(word) {
  let done = false;

  for (const p of prefixes) {
    if (word.match(new RegExp(`^${p}`)) && !done) {
      word = word.replace(new RegExp(`^${p}`), '');
      done = true;
    }
  }

  done = false;
  for (const e of endings) {
    if (word.match(new RegExp(`${e}$`)) && !done) {
      word = word.replace(new RegExp(`${e}$`), '');
      done = true;
    }
  }
  return word;
}
function getLevenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  var matrix = [];

  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i-1) == a.charAt(j-1)) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1,
                                Math.min(matrix[i][j-1] + 1,
                                         matrix[i-1][j] + 1));
      }
    }
  }

  return matrix[b.length][a.length];
};