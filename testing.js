
// \\\\\\\\\\\\\\\
// working puppeteer code that doesnt use express


const puppeteer = require('puppeteer');

(async () => {
const browser = await puppeteer.launch(); 

const page = await browser.newPage();

await page.goto("https://quotes.toscrape.com/")

const quotesScraper = await page.evaluate(() => {
    console.log("scraper evaluation method running");
    
    const quotes = document.querySelectorAll(".quote"); 
    const quotesArray = [];

    for (const quote of quotes) { 
        const texts = quote.querySelector(".text").innerText; 
        const author = quote.querySelector(".author").innerText;  

        quotesArray.push({
            quote: texts,
             author
        });

    }
    return quotesArray;
});


console.log(quotesScraper);

            await browser.close();
})();




// ////////////////////////////////
// alternate function


// const data = await page.evaluate(() => {
//   console.log("scraper evaluation method running");
  
//   const quotes = document.querySelectorAll(".quote");
//   return Array.from(quotes).map(quote => {
//     const texts = quote.querySelector(".text").innerText;
//     const author = quote.querySelector(".author").innerText;  
//     return {
//         quote: texts,
//         author: author
//     };
//   });

// });




// ////////////////////////////////
// original express code

// const express = require('express');
// const puppeteer = require('puppeteer');
// const app = express();
// const PORT = process.env.PORT || 3001;

// app.get('/scrape-data', async (req, res) => {
//   try {
//     const browser = await puppeteer.launch({ headless: false }); // Use headless mode
//     const page = await browser.newPage();
    
//     // Go to the target URL
//     await page.goto('https://quotes.toscrape.com/'); // Wait for network to be idle

//     // Wait for the table to appear
//     await page.waitForSelector('.quote', {timeout: 60000 }); // Adjust if necessary

//     // await page.screenshot({path: "quote.png" });

//     // Extract data from the page
// const quotesScraper = await page.evaluate(() => {
//   console.log("scraper evaluation method running");
  
//   const quotes = document.querySelectorAll(".quote"); 
//   const quotesArray = [];

//   for (const quote of quotes) { 
//       const texts = quote.querySelector(".text").innerText; 
//       const author = quote.querySelector(".author").innerText;  

//       quotesArray.push({
//           quote: texts,
//            author: author
//       });

//   }

//   return quotesArray;
// });


//     console.log(quotesScraper);

//     await browser.close();

//     res.json(data); // Send the data as JSON response
//   } catch (error) {
//     console.error('Error scraping data:', error);
//     res.status(500).json({ error: 'Failed to scrape data' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
