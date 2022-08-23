import puppeteer from "puppeteer";
const args = process.argv;
const url = args[2];

const getFood = async (url) => {
  try {
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
      () => document.querySelector("table th:nth-child(2)").textContent
    );

    const brand = await page.evaluate(
      () => document.querySelector(".brand-button").textContent
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

    const foodItem = {
      title: h1,
      brand,
      per,
      nutrition,
    };

    console.log(foodItem);
    await browser.close();
  } catch (error) {
    return console.error(error);
  }
};

getFood(url);
