import fs from "fs";
const route = (arg) => {
  // If url
  const urlRegex = /(https|http):\/\//i;
  if (arg.search(urlRegex)) return scrap([arg]);
  // If path to a file
  const buf = fs.readFileSync(arg);
  const str = buf.toString();
};

route();
