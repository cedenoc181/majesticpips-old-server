const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/scrape-data', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true }); // Use headless mode
    const page = await browser.newPage();
    
    // Go to the target URL
    await page.goto('https://www.marketwatch.com/market-data/currencies', { waitUntil: 'networkidle2' }); // Wait for network to be idle

    // Wait for the table to appear
    await page.waitForSelector('.table_row'); // Adjust if necessary

    // Extract data from the page
    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll('.table_row'); // Adjust the selector based on the actual page
      return Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td'); // Adjust the selector based on the actual page
        return {
          name: cells[0]?.innerText.trim() || 'N/A',
          value: cells[1]?.innerText.trim() || 'N/A',
          change: cells[2]?.innerText.trim() || 'N/A',
          percentChange: cells[3]?.innerText.trim() || 'N/A'
        };
      });
    });

    await browser.close();
    res.json(data); // Send the data as JSON response
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
