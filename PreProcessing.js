const fs = require("fs");
const lemmatizer = require("lemmatizer");

var speeches = [];
var stopWords;
var TermFrequency = [];
var iterate = 0;
//Implementing function of Tokenization
function Tokenization(xfile, stopWord) {
  var xfile = xfile.toLowerCase();
  var newfile = xfile.split("\n");
  var file = newfile[1];
  var words = file.split(" ");
  var PreTokens = {};
  var PostTokens = {};
  var Tokens = [];
  for (i = 0; i < words.length; i++) {
    word_clean = words[i]
      .split(".")
      .join("")
      .split(",")
      .join("")
      .split(":")
      .join("")
      .split("'")
      .join("")
      .split("-")
      .join("")
      .split("[")
      .join("")
      .split("]")
      .join("")
      .split('"')
      .join("")
      .split("?")
      .join("")
      .split(";")
      .join("");

    if (!stopWord.includes(word_clean)) {
      PreTokens[word_clean] = true;
      word_clean = lemmatizer.lemmatizer(word_clean);
      Tokens.push(word_clean);
    }
  }
  function Comparator(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  Tokens = Tokens.sort(Comparator);

  var newArray = [];
  var count = 0;
  var word = Tokens[0];
  for (i = 0; i < Tokens.length; i++) {
    if (word == Tokens[i]) {
      count++;
    } else {
      newArray.push(word, count);
      count = 1;
      word = Tokens[i];
    }
  }
  newArray.push(word, count);
  TermFrequency[iterate] = newArray;
  iterate++;
  //for unique tokens
  var result = Object.keys(PreTokens).map((key) => {
    return key;
  });

  //Calling Lemmatizer Function
  for (i = 0; i < result.length; i++) {
    result[i] = lemmatizer.lemmatizer(result[i]);
    PostTokens[result[i]] = true;
  }
  //for Storing non-repititve Tokens
  var results = Object.keys(PostTokens).map((key) => {
    return key;
  });

  return results;
}
//Function For making Inverted Index
function MakeInvertedIndex(Result) {
  var PostingList = [];
  for (i = 0; i < 56; i++) {
    Result[i].map((key) => {
      PostingList.push([key, i]);
    });
  }

  function Comparator(a, b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  }
  var Dictionary = [];

  PostingList = PostingList.sort(Comparator);
  var count = 0;
  var p = 0;
  var l = 0;
  var z = 0;
  var prev;
  var pre;
  PostingList.forEach((value, index) => {
    if (z == 0) {
      prev = value[0];
      p = value[1];
      Dictionary[l] = [value[0], p];
      z++;
    }
    if (prev != value[0]) {
      count = 0;
      p = value[1];
      prev = value[0];
      Dictionary[++l] = [value[0], p];
    }
    if (prev == value[0]) {
      p = p + " " + value[1];
      count++;
      var log = 56 / count;
      log = Math.log(log) / Math.log(10);
      Dictionary[l] = [value[0], p, log];
    }
  });
  return Dictionary;
}

//Extracting speeches from files
for (i = 0; i < 56; i++) {
  speeches[i] = fs.readFileSync("./TrumpSpeechs/speech_" + i + ".txt", "utf-8");
}
//Extracting stopwords from files
stopWords = fs.readFileSync("Stopword-List.txt", "utf-8");
var stopWord = stopWords.split(" ");

//Sending Data For PreProcessing
var Result = [];

for (var j = 0; j < 56; j++) {
  Result[j] = Tokenization(speeches[j], stopWord);
}

//Calling InvertedIndex
var Dictionary = MakeInvertedIndex(Result);
//console.log(lemmatizer.lemmatizer("developments"));
module.exports = { TermFrequency, stopWord, Dictionary };
