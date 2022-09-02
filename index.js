import { AppError } from "./components/errors/appErrors.js";
import scrape from "./components/scrape/scrape.js";
import fs from "fs";
import path from "path";
import handleError from "./components/errors/handleError.js";
import handleResults from "./components/handleResults.js";

const args = process.argv;
const inputStr = args[2];

// Handle uncaught errors
process.on("uncaughtException", (err) => {
  handleError(err);
  process.exit(1); // mandatory (as per the Node.js docs)
});

const checkIfUrl = (inputStr) => {
  const urlRegex = /(https|http):\/\//i;
  return inputStr.search(urlRegex) !== -1;
};
(async () => {
  let foods;
  // If inputStr is a url
  if (checkIfUrl(inputStr)) {
    foods = await scrape([inputStr]);
  } else {
    // If inputStr is a path to a file
    if (path.extname(inputStr) !== ".json")
      throw new AppError("Provided file is not .json: " + inputStr);
    const buf = fs.readFileSync(inputStr);
    const urlArr = JSON.parse(buf.toString());
    if (!(urlArr instanceof Array))
      throw new AppError("JSON file doesn't have an array inside: " + inputStr);
    foods = await scrape(urlArr);
  }
  handleResults(foods);
})();
