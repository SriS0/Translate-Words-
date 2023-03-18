const fs = require("fs");

// Read in the input files
const englishText = fs.readFileSync("t8.shakespeare.txt", "utf-8");
const findWords = fs.readFileSync("find_words.txt", "utf-8").split("\n");
const dictionary = fs
  .readFileSync("french_dictionary.csv", "utf-8")
  .split("\n");

// Parse the dictionary into a JavaScript object
const frenchWords = {};
for (let i = 1; i < dictionary.length; i++) {
  const [english, french] = dictionary[i].split(",");
  frenchWords[english] = french;
}

// Replace English words with French words in the text
let translatedText = englishText;
let frequency = {};
for (let i = 0; i < findWords.length; i++) {
  const word = findWords[i].trim();
  const regex = new RegExp("\\b" + word + "\\b", "gi");
  if (frenchWords[word]) {
    translatedText = translatedText.replace(regex, frenchWords[word]);
    frequency[word] =
      (frequency[word] || 0) + (translatedText.match(regex) || []).length;
  }
}

// Write the translated text to a file
fs.writeFileSync("t8.shakespeare.translated.txt", translatedText);

// Write the frequency data to a CSV file
let frequencyData = "English word,French word,Frequency\n";
for (let word in frequency) {
  frequencyData += `${word},${frenchWords[word]},${frequency[word]}\n`;
}
fs.writeFileSync("frequency.csv", frequencyData);

// Calculate processing time and memory usage
const endTime = process.hrtime();
const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;

// Write performance data to file
fs.writeFileSync(
  "performance.txt",
  `Time to process: ${endTime[0]} seconds ${
    endTime[1] / 1000000
  } milliseconds\nMemory used: ${Math.round(memoryUsed * 100) / 100} MB`
);

// Output the unique words and processing time and memory
const uniqueWords = Object.keys(frequency);
const processingTime = process.hrtime();
console.log(`Unique words replaced: ${uniqueWords.length}`);
console.log(`Time to process: ${processingTime[0]} seconds`);
console.log(
  `Memory used: ${
    Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100
  } MB`
);
