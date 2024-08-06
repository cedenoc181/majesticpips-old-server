
const puppeteer = require('puppeteer');

(async () => {
const browser = await puppeteer.launch(); 

const page = await browser.newPage();

await page.goto("https://quotes.toscrape.com/")

const data = await page.evaluate(() => {
    console.log("scraper evaluation method running");
    
    const quotes = document.querySelectorAll(".quote");
    return Array.from(quotes).map(quote => {
      const texts = quote.querySelector(".text").innerText;
      const author = quote.querySelector(".author").innerText;  
      return {
          quote: texts,
          author: author
      };
    });

  });
  console.log(data);
  await browser.close();
 }) ();