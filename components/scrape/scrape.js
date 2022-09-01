import puppeteer from "puppeteer";
import getFood from "./get-ah.js";
import config from "../../config.js";
import ora from "ora";
import fs from "fs";

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
    if (
      config.printResultsIntoJSON &&
      typeof config.printResultsIntoJSON === "string"
    ) {
      fs.writeFileSync(config.printResultsIntoJSON, JSON.stringify(foods));
    }
  } catch (error) {
    spinner.stop();
    console.error(error);
  } finally {
    await browser.close();
  }
};

export default scrap;
