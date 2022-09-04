const validateUrl = (url) => {
  if (url.search(/\/\/www.ah.nl\//i) !== -1) return "ah";
  if (url.search(/\/\/www.jumbo.com\//i) !== -1) return "jumbo";
  if (url.search(/\/\/www.walmart.com\//i) !== -1) return "walmart";
  return undefined;
};

export default validateUrl;
