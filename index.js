import puppeteer from "puppeteer";
import urls from "./urls.js";
// const args = process.argv;
// const url = args[2];

const getFood = async (url, page) => {
  try {
    await page.goto(url);
    const foodItem = await page.evaluate(() => {
      const regex = /\d+ *(gram|ml|l|g|milliliter|liter|kilogram)/i;

      // TITLE
      const getTitle = () => {
        const headers = document.querySelectorAll("h1");
        if (!headers || headers.length === 0) {
          console.error("~~ Can't find <h1> on a page");
          return null;
        }
        const title = headers[headers.length - 1].textContent;
        if (!title) {
          console.error("~~ <h1> is empty");
          return null;
        }
        return title;
      };

      // PER
      const getPer = () => {
        return document
          .querySelector("table th:nth-child(2)")
          .textContent.toLowerCase()
          .match(regex)[0];
      };

      // BRAND
      const getBrand = () => {
        return document
          .querySelector(".brand-button")
          .textContent.replace(/Alles van /, "");
      };

      // NUTRITION
      getNutrition = () => {
        const tdArr = document.querySelectorAll("table tr td");
        const convertToNumber = (str) => {
          return parseFloat(str.replace(/ g/, ""));
        };
        const nutrition = [...tdArr].reduce((prevVal, curVal, index) => {
          if (curVal.textContent === "Vet")
            return {
              ...prevVal,
              fats: convertToNumber(tdArr[index + 1].textContent),
            };
          if (curVal.textContent === "Koolhydraten")
            return {
              ...prevVal,
              carbohydrates: convertToNumber(tdArr[index + 1].textContent),
            };
          if (curVal.textContent === "Eiwitten")
            return {
              ...prevVal,
              proteins: convertToNumber(tdArr[index + 1].textContent),
            };
          return prevVal;
        }, {});
        return nutrition;
      };

      // PORTION SIZE
      const getPortionSize = () => {
        const dlNodeList = document.querySelectorAll("dl");
        const portionSize = [...dlNodeList].reduce((prevVal, curVal, index) => {
          const dt = curVal.querySelector("dt");
          if (!dt.textContent.match(/Portiegrootte/)) return prevVal;
          const dd = dlNodeList[index].querySelector("dd");
          return dd.textContent;
        }, null);
        return portionSize.match(regex)[0];
      };

      // PACKAGE SIZE
      const getPackageSize = () => {
        const productInfoNodeList = document.querySelectorAll(
          ".product-info-content-block"
        );
        const productInfo = [...productInfoNodeList].find((item) =>
          item.querySelector("h4").textContent.match(/gewicht/i) ? true : false
        );
        return productInfo.querySelector("h4 + p").textContent;
      };

      const title = getTitle();
      const brand = getBrand();
      const packageSize = getPackageSize();
      const per = getPer();
      const nutrition = getNutrition();
      const portionSize = getPortionSize();
      return {
        title,
        brand,
        packageSize,
        per,
        ...nutrition,
        portionSize,
      };
    });
    return foodItem;
  } catch (error) {
    return console.error(error);
  }
};

const scrap = async (urls) => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();

    let foods = [];
    for (const url of urls) {
      const food = await getFood(url, page);
      foods = [...foods, food];
    }

    console.table(foods);
    await browser.close();
  } catch (error) {
    console.error(error);
    await browser.close();
  }
};

scrap(urls);
