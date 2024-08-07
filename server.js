
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/scrape-data', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();
    
    // Go to the target URL
    await page.goto('https://markets.ft.com/data/currencies', 
        { waitUntil: 'networkidle2' });// Ensure the page has fully loaded
    

    // Wait for the table to appear
       await page.waitForFunction(() => {
    return document.querySelector('thead') && document.querySelector('th'); 
}, { timeout: 60000 });

   // Log the HTML content of the page
    const pageContent = await page.content();
    console.log(pageContent);

    // Take a screenshot for verification
    // await page.screenshot({path: "currency.png" });
    
    // Extract data from the page
    const data = await page.evaluate(() => {
      const currencyElements = document.querySelectorAll('th'); 

      const currencyList = [];

      for (const currencyElement of currencyElements) {
        const currencyLink = currencyElement.querySelector('div');
        const abbriviation = currencyElement.querySelector('.mod-cross-rates__currency-text'); //testing this line to get abbriviation 
        const currencyAbr = currencyLink ? currencyLink.innerText : '';
        const abbriv = abbriviation ? abbriviation.innerText : '';

        currencyList.push({
          name: currencyAbr,
          abbriviation: abbriv

        });
      }
      return currencyList; //currencyList
    });

    console.log(data + "data acquired");

    await browser.close();
    res.json(data); // Send the data as JSON response
  }
   catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// tested and working

// const puppeteer = require('puppeteer');

// (async () => {
//   try {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     // Go to the target URL
//     await page.goto('https://markets.ft.com/data/currencies', { waitUntil: 'networkidle2' });

//     // Wait for the table to appear
//     await page.waitForFunction(() => {
//         return document.querySelector('thead') && document.querySelector('tr');
//       }, { timeout: 60000 });

//     // Take a screenshot for verification
//     await page.screenshot({ path: 'currency.png' });

//     // Extract data from the page
//     const data = await page.evaluate(() => {
//       const currencyElements = document.querySelectorAll('thead');
//       const currencyList = [];

//       currencyElements.forEach(currencyElement => {
//         const currencyLink = currencyElement.querySelector('tr');
//         const currencyAbr = currencyLink ? currencyLink.innerText : '';

//         currencyList.push({
//           name: currencyAbr
//         });
//       });

//       return currencyList;
//     });

//     console.log(data);

//     await browser.close();
//   } catch (error) {
//     console.error('Error scraping data:', error);
//   }
// })();

