// import handleError from "./utils/handleError.js";
import log from "./utils/log.js";
import scrap from "./scrap.js";
import fs from "fs";
const args = process.argv;
const inputStr = args[2];

const route = (inputStr) => {
  // If inputStr is a url
  const urlRegex = /(https|http):\/\//i;
  if (inputStr.search(urlRegex) !== -1) return scrap([inputStr]);
  // If inputStr is a path to a file
  const buf = fs.readFileSync(inputStr);
  const urlArr = JSON.parse(buf.toString());
  if (!(urlArr instanceof Array)) return log.red("~~ Not array");
  scrap(urlArr);
};

route(inputStr);

// scrap(urls);

// process.on("uncaughtException", (err) => {
//   handleError(err);
//   process.exit(1); // mandatory (as per the Node.js docs)
// });
