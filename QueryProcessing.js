const Data = require("./PreProcessing.js");
const Dictionary = Data["Dictionary"];
const TermFrequency = Data["TermFrequency"];
const stopWord = Data["stopWord"];
const lemmatizer = require("lemmatizer");
const readline = require("readline");

//Function to take input
function Comparator(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
function getInput() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter your Query: ", (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}

async function QueryProcessing() {
  var Answer = await getInput();
  Answer = Answer.toLowerCase();
  var ParsedQuery = [];
  var words = Answer.split(" ");
  words.forEach((key) => {
    if (!stopWord.includes(key)) {
      var t = lemmatizer.lemmatizer(key);
      ParsedQuery.push(t);
    }
  });
  ParsedQuery.sort(Comparator);
  var ParsedQuery1 = [];
  var temp = 0;
  var newWord = ParsedQuery[0];
  for (i = 0; i < ParsedQuery.length; i++) {
    if (newWord == ParsedQuery[i]) {
      temp++;
    } else {
      ParsedQuery1.push(newWord, temp);
      temp = 1;
      newWord = ParsedQuery[i];
    }
  }
  ParsedQuery1.push(newWord, temp);
  console.log(ParsedQuery1);
  var QueryVector = [];
  var k = 0;
  for (i = 0; i < Dictionary.length; i++) {
    word = Dictionary[i][0];
    var idf = Dictionary[i][2];
    if (ParsedQuery1.includes(word)) {
      var index1 = ParsedQuery1.indexOf(word);
      var tf1 = ParsedQuery1[index1 + 1];
      var result1 = tf1 * idf;
      QueryVector.push(result1);
    } else {
      var tf1 = 0;
      QueryVector.push(0);
    }
  }

  var Array1 = [];
  for (var i = 0; i < TermFrequency.length; i++) {
    Array1[i] = [];
    for (var j = 0, k = 0; j < Dictionary.length; j++) {
      if (TermFrequency[i].includes(Dictionary[j][0])) {
        var idf = Dictionary[j][2];
        var index = TermFrequency[i].indexOf(Dictionary[j][0]);
        var tf = TermFrequency[i][index + 1];
        var res = tf * idf;
        Array1[i].push(res);
      } else {
        Array1[i].push(0);
      }
    }
  }
  var Sum = [];
  var sum = 0;
  var square1 = 0;
  var square2 = 0;
  for (var i = 0; i < Array1.length; i++) {
    sum = 0;
    square1 = 0;
    square2 = 0;
    for (var j = 0; j < QueryVector.length; j++) {
      var x = Array1[i][j];
      var y = QueryVector[j];
      square1 += x * x;
      square2 += y * y;
      sum += x * y;
    }
    square1 = Math.sqrt(square1);
    square2 = Math.sqrt(square2);
    var ans = square1 * square2;
    sum = sum / ans;
    Sum[i] = [sum, i];
  }
  Sum.sort(function (a, b) {
    return b[0] - a[0];
  });
  var count = 0;
  largest = Sum[i];
  for (i = 0; i < Sum.length; i++) {
    if (Sum[i][0] > 0.0005) {
      console.log(Sum[i]);
      console.log(Sum[i][1]);
      count++;
    }
  }
  console.log("Length:" + count);
}

QueryProcessing();
