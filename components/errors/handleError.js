import { AppError } from "./appErrors.js";
import log from "../../utils/log.js";

const logError = (message) => log.error("~~ " + message);

const handleError = (err) => {
  if (err instanceof AppError) return logError(`${err.name}: ${err.message}`);
  return console.log(err.stack);
};

export default handleError;
