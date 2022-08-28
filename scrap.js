import puppeteer from "puppeteer";
import getFood from "./ah.js";

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

export default scrap;
