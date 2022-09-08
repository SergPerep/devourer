const formatCalories = (energyStr) => {
  if (!energyStr || typeof energyStr !== "string") return undefined;
  const regex = /\d+\.*\d+ *kcal/i;
  const kcalStr = energyStr.match(regex)[0];
  const valueStr = kcalStr?.match(/\d+\.*\d+/i)[0];
  if (!valueStr || typeof energyStr !== "string") return undefined;
  return parseFloat(valueStr);
};

export default formatCalories;
