// Converts amount of product to appropriate format
// 1 kg -> 1000 g
// 2.5 l -> 2500 ml
const formatAmount = (amountStr, options = { outputType: "string" }) => {
  let value = parseFloat(amountStr);
  if (!value) return amountStr;
  let unitsArr = amountStr.match(/(gram|g|milliliter|ml|liter|l|kilogram|kg)/i);
  if (!(unitsArr instanceof Array)) return amountStr;
  let unit = unitsArr[0]?.toLowerCase();
  switch (unit) {
    case "liter":
    case "l":
      value = value * 1000;
      unit = "ml";
      break;
    case "kilogram":
    case "kg":
      value = value * 1000;
      unit = "g";
      break;
    case "gram":
      unit = "g";
      break;
    case "milliliter":
      unit = "ml";
  }
  if (options?.outputType === "object") return { value, unit };
  if (options?.outputType === "string" || true) return `${value} ${unit}`;
};

export default formatAmount;
