
// \\\\\\\\\\\\\\\
// working puppeteer code that doesnt use express


// const puppeteer = require('puppeteer');

// (async () => {
// const browser = await puppeteer.launch(); 

// const page = await browser.newPage();

// await page.goto("https://quotes.toscrape.com/")

// const quotesScraper = await page.evaluate(() => {
//     console.log("scraper evaluation method running");
    
//     const quotes = document.querySelectorAll(".quote"); 
//     const quotesArray = [];

//     for (const quote of quotes) { 
//         const texts = quote.querySelector(".text").innerText; 
//         const author = quote.querySelector(".author").innerText;  

//         quotesArray.push({
//             quote: texts,
//              author
//         });

//     }
//     return quotesArray;
// });


// console.log(quotesScraper);

//             await browser.close();
// })();




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



// currency code tested and working 

const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Go to the target URL
    await page.goto('https://markets.ft.com/data/currencies', { waitUntil: 'networkidle2' });

    // Wait for the table to appear
    await page.waitForFunction(() => {
        return document.querySelector('thead'),  document.querySelector('tbody') && document.querySelector('tr');
      }, { timeout: 60000 });

    // Take a screenshot for verification
    // await page.screenshot({ path: 'currency.png' });

    // Extract data from the page
    const data = await page.evaluate(() => {
      const currencyConversions = document.querySelectorAll('tbody tr:nth-of-type(3)');
      const currencyElements = document.querySelectorAll('thead');
      const currencyList = [];

      for (const currencyElement of currencyElements) {
        const currencyLink = currencyElement.querySelector('div');
        const abbreviation = currencyElement.querySelector('.mod-cross-rates__currency-text');
        const currencyAbr = currencyLink ? currencyLink.innerText : '';
        const abbriv = abbreviation ? abbreviation.innerText : '';

        for (const currencyConversion of currencyConversions) {
        const conversion = currencyConversion.querySelector('a');
        const conversionQuote = conversion ? conversion.innerText : '';

            currencyList.push({
                name: currencyAbr, 
                abbreviation: abbriv, 
                conversion: conversionQuote
            });
            console.log(currencyList);
        }
      };
      
      return currencyList;
    });

    console.log(data);

    

    await browser.close();
  } catch (error) {
    console.error('Error scraping data:', error);
  }
})();

////////////////////////////////////////////////////////////////////////    //////////////////////////////////////////////////////////////////////////

//server.js working code

// const express = require('express');
// const puppeteer = require('puppeteer');
// const app = express();
// const PORT = process.env.PORT || 3001;
// const cors = require('cors');

// app.use(cors());
// app.get('/scrape-data', async (req, res) => {
//   try {
//     const browser = await puppeteer.launch();

//     const page = await browser.newPage();
    
//     // Go to the target URL
//     await page.goto('https://markets.ft.com/data/currencies', 
//         { waitUntil: 'networkidle2' });// Ensure the page has fully loaded
    

//     // Wait for the table to appear
//        await page.waitForFunction(() => {
//     return document.querySelector('thead') && document.querySelector('th'); 
// }, { timeout: 60000 });

//    // Log the HTML content of the page
//     const pageContent = await page.content();
//     // console.log(pageContent);

//     // Take a screenshot for verification
//     // await page.screenshot({path: "currency.png" });
    
//     // Extract data from the page
//     const data = await page.evaluate(() => {
//       const currencyElements = document.querySelectorAll('th'); 

//       const currencyList = [];

//       for (const currencyElement of currencyElements) {
//         const currencyLink = currencyElement.querySelector('div');
//         const abbriviation = currencyElement.querySelector('.mod-cross-rates__currency-text'); //testing this line to get abbriviation 
//         const currencyAbr = currencyLink ? currencyLink.innerText : '';
//         const abbriv = abbriviation ? abbriviation.innerText : '';

//         currencyList.push({
//           name: currencyAbr,
//           abbriviation: abbriv

//         });
//       }
//       return currencyList; //currencyList
//     });

//     console.log(data + "data acquired");

//         await browser.close();
        
//     res.json(data); // Send the data as JSON response
//   }
//    catch (error) {
//     console.error('Error scraping data:', error);
//     res.status(500).json({ error: 'Failed to scrape data' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


