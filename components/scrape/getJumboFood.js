const getJumboFood = async (url, page) => {
  try {
    await page.goto(url, { timeout: 0 });
    await page.screenshot({ path: "./screenshots/example.png" });
    const foodItem = await page.evaluate(() => {
      // TITLE
      const getTitle = () => {
        const title = document.querySelector("h1 strong")?.textContent;
        return title;
      };

      // BRAND
      const getBrand = (title) => {
        return title.match(/\w+/i)[0];
      };

      // PACKAGE SIZE
      const getPackageSize = () => {
        return document.querySelector(".product-description h2")?.textContent;
      };

      // PER
      const getPer = () => {
        const thNodeList = document.querySelectorAll("table.jum-table tr th");
        const thEl = [...thNodeList].find(
          (thEl) => thEl?.textContent?.search(/per 100/i) !== -1
        );
        return thEl.textContent;
      };

      // NUTRITION
      const getNutrition = () => {
        const tdNodeList = document.querySelectorAll("table.jum-table tr td");
        const nutrition = [...tdNodeList].reduce((prevVal, curVal, index) => {
          switch (curVal?.textContent?.toLowerCase()) {
            case "energie":
              return {
                ...prevVal,
                energy: tdNodeList[index + 1].textContent,
              };
            case "vetten":
              return {
                ...prevVal,
                fats: tdNodeList[index + 1].textContent,
              };
            case "koolhydraten":
              return {
                ...prevVal,
                carbohydrates: tdNodeList[index + 1].textContent,
              };
            case "eiwitten":
              return {
                ...prevVal,
                proteins: tdNodeList[index + 1].textContent,
              };
            default:
              return prevVal;
          }
        }, {});
        return nutrition;
      };

      const title = getTitle();
      const brand = getBrand(title);
      const packageSize = getPackageSize();
      const per = getPer();
      const nutrition = getNutrition();
      return {
        title,
        brand,
        packageSize,
        per,
        ...nutrition,
      };
    });
    return foodItem;
  } catch (error) {
    return console.error(error);
  }
};

export default getJumboFood;
