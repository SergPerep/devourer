import { AppError } from "./components/errors/appErrors.js";
import scrape from "./components/scrape/scrape.js";
import fs from "fs";
import path from "path";
import handleError from "./components/errors/handleError.js";

const args = process.argv;
const inputStr = args[2];

// Handle uncaught errors
process.on("uncaughtException", (err) => {
  handleError(err);
  process.exit(1); // mandatory (as per the Node.js docs)
});

const route = (inputStr) => {
  // If inputStr is a url
  const urlRegex = /(https|http):\/\//i;
  if (inputStr.search(urlRegex) !== -1) return scrape([inputStr]);
  // If inputStr is a path to a file
  if (path.extname(inputStr) !== ".json")
    throw new AppError("Provided file is not .json: " + inputStr);
  const buf = fs.readFileSync(inputStr);
  const urlArr = JSON.parse(buf.toString());
  if (!(urlArr instanceof Array))
    throw new AppError("JSON file doesn't have an array inside: " + inputStr);
  scrape(urlArr);
};

route(inputStr);
