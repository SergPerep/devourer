import config from "./../config.js";
import fs from "fs";

const handleResults = (results) => {
  if (config.logResultsAs === "tables") {
    console.table(results);
  } else {
    console.log(results);
  }
  if (
    config.printResultsIntoJSON &&
    typeof config.printResultsIntoJSON === "string"
  ) {
    fs.writeFileSync(config.printResultsIntoJSON, JSON.stringify(results));
  }
};

export default handleResults;
