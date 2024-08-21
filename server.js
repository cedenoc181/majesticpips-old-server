const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');

app.use(cors(
  //for frontend domain
));

// Store scraped data and timestamp
let cachedData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 1000; // Cache data for 1 minute

app.get('/scrape-data', async (req, res) => {
  try {
    const now = Date.now();

    // Check if cached data is still valid
    if (cachedData && (now - cacheTimestamp < CACHE_DURATION)) {
      console.log('Returning cached data');
      return res.json(cachedData);
    } 

    // Scrape new data
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://markets.ft.com/data/currencies', { waitUntil: 'networkidle2' });

    await page.waitForFunction(() => document.querySelector('thead') && document.querySelector('tbody') && document.querySelector('tr'), { timeout: 60000 });

    let data = await page.evaluate(() => {
      const currencyElements = document.querySelectorAll('thead th');
      const currencyList = [];

      // Iterate over each currency
      for (let i = 0; i < currencyElements.length; i++) {
        const currencyElement = currencyElements[i];

        const currencyLink = currencyElement.querySelector('div');
        const abbreviation = currencyElement.querySelector('.mod-cross-rates__currency-text');
        const currencyAbr = currencyLink ? currencyLink.innerText : '';
        const abbriv = abbreviation ? abbreviation.innerText : '';

        // Adjust the index by subtracting 1 to correctly match the <th> with the corresponding <td>
        const currencyConversionTd = document.querySelector(`tbody tr:nth-of-type(3) td:nth-of-type(${i + 1})`);
        const conversionQuote = currencyConversionTd ? currencyConversionTd.innerText : '';

        let conversionObject = {};
        conversionObject = conversionQuote;

        // Push the result into the currency list
        currencyList.push({
          name: currencyAbr,
          abbreviation: abbriv,
          conversions: conversionObject
        });
      }

      return currencyList;
    });

     // Limit the data to the first 9 items
        data = data.slice(1, 9);

    console.log(data);
    await browser.close();

    // Cache data and timestamp
    cachedData = data;
    cacheTimestamp = now;

    console.log('Data scraped and cached');
    res.json(data);
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/scrape-data`);
});
