import puppeteer from "puppeteer";
import getFood from "./get-ah.js";
import config from "../../config.js";
import ora from "ora";

const scrap = async (urls) => {
  const spinner = ora("Scanning page").start();

  spinner.color = "magenta";
  spinner.text = "Launch puppeteer";
  const browser = await puppeteer.launch();
  try {
    spinner.text = "Launch browser";
    const page = await browser.newPage();

    let foods = [];
    for (const url of urls) {
      spinner.text = `Scanning page: ${url}`;
      const food = await getFood(url, page);
      foods = [...foods, food];
    }

    spinner.stop();
    if (config.logResultsAs === "tables") {
      console.table(foods);
    } else {
      console.log(foods);
    }
  } catch (error) {
    spinner.stop();
    console.error(error);
  } finally {
    await browser.close();
  }
};

export default scrap;
