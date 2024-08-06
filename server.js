const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', async (req, res) => {
  try {
    const browser = await puppeteer.launch(); // Use headless mode
    const page = await browser.newPage();
    
    // Go to the target URL
    await page.goto('https://quotes.toscrape.com/'); // Wait for network to be idle

    // Wait for the table to appear
    await page.waitForSelector('.quote'); // Adjust if necessary

    // Extract data from the page
    const data = await page.evaluate(() => {
      const quotes = document.querySelectorAll('.quote'); // Adjust the selector based on the actual page
      return Array.from(quotes).map(quote => {
        const texts = quote.querySelector(".text").innerText;
        const author = quote.querySelector(".author").innerText;  
        return {
            quote: texts,
            author: author
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