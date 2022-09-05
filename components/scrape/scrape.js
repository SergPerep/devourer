import puppeteer from "puppeteer";
import getAHFood from "./getAHFood.js";
import getJumboFood from "./getJumboFood.js";
import ora from "ora";
import validateUrl from "../../utils/validateUrl.js";

const scrape = async (urls) => {
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
      const storeName = validateUrl(url);
      let food = {};
      switch (storeName) {
        case "ah":
          food = await getAHFood(url, page);
          break;
        case "jumbo":
          food = await getJumboFood(url, page);
          break;
        case "walmart":
          food = undefined;
          break;
        default:
          food = undefined;
      }
      foods = [...foods, food];
    }

    spinner.stop();
    return foods;
  } catch (error) {
    spinner.stop();
    console.error(error);
  } finally {
    await browser.close();
  }
};

export default scrape;
