import formatAmount from "../../utils/formatAmount.js";
import formatCalories from "../../utils/formatCalories.js";
const getAHFood = async (url, page) => {
  try {
    await page.goto(url);
    const foodItem = await page.evaluate(() => {
      const regex = /\d+\.*\d+ *(gram|ml|l|g|milliliter|liter|kilogram)/i;

      // TITLE
      const getTitle = () => {
        const headers = document.querySelectorAll("h1");
        if (!headers || headers.length === 0) return undefined;
        const title = headers[headers.length - 1]?.textContent;
        return title;
      };

      // PER
      const getPer = () => {
        return document
          .querySelector("table th:nth-child(2)")
          ?.textContent?.toLowerCase()
          ?.match(regex)[0];
      };

      // BRAND
      const getBrand = () => {
        return document
          .querySelector(".brand-button")
          ?.textContent?.replace(/Alles van /, "");
      };

      // NUTRITION
      getNutrition = () => {
        const tdArr = document.querySelectorAll("table tr td");
        if (tdArr.length === 0) return undefined;
        const convertToNumber = (str) => {
          if (!str || typeof str !== "string") return undefined;
          return parseFloat(str.replace(/ g/, ""));
        };
        const nutrition = [...tdArr].reduce((prevVal, curVal, index) => {
          switch (curVal?.textContent?.toLowerCase()) {
            case "energie":
              return {
                ...prevVal,
                energy: tdArr[index + 1]?.textContent,
              };
            case "vet":
              return {
                ...prevVal,
                fats: convertToNumber(tdArr[index + 1]?.textContent),
              };
            case "koolhydraten":
              return {
                ...prevVal,
                carbohydrates: convertToNumber(tdArr[index + 1]?.textContent),
              };
            case "eiwitten":
              return {
                ...prevVal,
                proteins: convertToNumber(tdArr[index + 1]?.textContent),
              };
          }
          return prevVal;
        }, {});
        return nutrition;
      };

      // PORTION SIZE
      const getPortionSize = () => {
        const dlNodeList = document.querySelectorAll("dl");
        if (dlNodeList.length === 0) return undefined;
        const portionSize = [...dlNodeList].reduce((prevVal, curVal, index) => {
          const dt = curVal.querySelector("dt");
          if (!dt?.textContent?.match(/Portiegrootte/)) return prevVal;
          const dd = dlNodeList[index].querySelector("dd");
          return dd?.textContent;
        }, null);
        return portionSize?.match(regex)[0];
      };

      // PACKAGE SIZE
      const getPackageSize = () => {
        const productInfoNodeList = document.querySelectorAll(
          ".product-info-content-block"
        );
        if (productInfoNodeList.length === 0) return undefined;
        const productInfo = [...productInfoNodeList].find((item) =>
          item.querySelector("h4")?.textContent?.match(/gewicht/i)
            ? true
            : false
        );
        return productInfo.querySelector("h4 + p")?.textContent;
      };

      const title = getTitle();
      const brand = getBrand();
      const packageSize = getPackageSize();
      const per = getPer();
      const nutrition = getNutrition();
      // const portionSize = getPortionSize();
      return {
        title,
        brand,
        packageSize,
        per,
        ...nutrition,
        // portionSize,
      };
    });

    return {
      name: { nl: foodItem.title },
      // url,
      // storeName: "ah",
      brands: [foodItem.brand],
      unit: formatAmount(foodItem.packageSize, { outputType: "object" })?.unit,

      packageSize: formatAmount(foodItem.packageSize, { outputType: "object" })
        ?.value,
      // portionSize: formatAmount(foodItem.portionSize, { outputType: "object" })
      //   ?.value,
      nutrition: {
        per: formatAmount(foodItem.per),
        kcal: formatCalories(foodItem.energy),
        fats: foodItem.fats,
        carbohydrates: foodItem.carbohydrates,
        proteins: foodItem.proteins,
      },
    };
  } catch (error) {
    return console.error(error);
  }
};

export default getAHFood;
