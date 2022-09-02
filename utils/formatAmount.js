// Converts amount of product to appropriate format
// 1 kg -> 1000 g
// 2.5 l -> 2500 ml
const formatAmount = (amountStr, options = { outputType: "string" }) => {
  let value = parseFloat(amountStr);
  if (!value) return amountStr;
  let unitsArr = amountStr.match(/(gram|g|milliliter|ml|liter|l|kilogram|kg)/i);
  if (!(unitsArr instanceof Array)) return amountStr;
  let units = unitsArr[0]?.toLowerCase();
  switch (units) {
    case "liter":
    case "l":
      value = value * 1000;
      units = "ml";
      break;
    case "kilogram":
    case "kg":
      value = value * 1000;
      units = "g";
      break;
    case "gram":
      units = "g";
      break;
    case "milliliter":
      units = "ml";
  }
  if (options?.outputType === "object") return { value, units };
  if (options?.outputType === "string" || true) return `${value} ${units}`;
};

export default formatAmount;
