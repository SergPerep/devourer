import puppeteer from "puppeteer";
import getFood from "./get-ah.js";
import config from "../../config.js";

const scrap = async (urls) => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();

    let foods = [];
    for (const url of urls) {
      const food = await getFood(url, page);
      foods = [...foods, food];
    }

    if (config.logResultsAs === "tables") {
      console.table(foods);
    } else {
      console.log(foods);
    }

    await browser.close();
  } catch (error) {
    console.error(error);
    await browser.close();
  }
};

export default scrap;
