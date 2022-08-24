import puppeteer from "puppeteer";
const args = process.argv;
const url = args[2];

const getFood = async (url) => {
  try {
    // const regEx = /\d+ *(g|ml|l|gram|milliliter)/i;
    // const regEx = new RegExp(/\d+ *(g|ml|l|gram|milliliter)/, "i");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    // await page.click("#accept-cookies");
    // await page.screenshot({ path: "./screenshots/example.png" });
    const h1 = await page.evaluate(() => {
      const headers = document.querySelectorAll("h1");
      return headers[headers.length - 1].textContent;
    });
    const per = await page.evaluate(
      () =>
        document
          .querySelector("table th:nth-child(2)")
          .textContent.toLowerCase()
          .match(/\d+ *(g|ml|l|gram|milliliter)/i)[0]
    );

    const brand = await page.evaluate(() =>
      document
        .querySelector(".brand-button")
        .textContent.replace(/Alles van /, "")
    );

    const nutrition = await page.evaluate(() => {
      const tdArr = document.querySelectorAll("table tr td");
      const nutrition = [...tdArr].reduce((prevVal, curVal, index) => {
        if (curVal.textContent === "Vet")
          return { ...prevVal, fats: tdArr[index + 1].textContent };
        if (curVal.textContent === "Koolhydraten")
          return { ...prevVal, carbohydrates: tdArr[index + 1].textContent };
        if (curVal.textContent === "Eiwitten")
          return { ...prevVal, proteins: tdArr[index + 1].textContent };
        return prevVal;
      }, {});
      return nutrition;
    });

    const portionSize = await page.evaluate(() => {
      const dlNodeList = document.querySelectorAll("dl");
      const portionSize = [...dlNodeList].reduce((prevVal, curVal, index) => {
        const dt = curVal.querySelector("dt");
        if (!dt.textContent.match(/Portiegrootte/)) return prevVal;
        const dd = dlNodeList[index].querySelector("dd");
        return dd.textContent;
      }, null);
      return portionSize.match(/\d+ *(g|ml|l|gram|milliliter)/i)[0];
    });

    const foodItem = {
      title: h1,
      brand,
      per,
      nutrition,
      portionSize,
    };

    console.log(foodItem);
    await browser.close();
  } catch (error) {
    return console.error(error);
  }
};

getFood(url);
