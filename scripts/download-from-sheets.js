const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// The categories to download
const categories = ['restaurants', 'bars', 'cafes', 'movies', 'shows', 'date-ideas'];

// The Google Sheet ID from environment variables
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

/**
 * Download data from Google Sheets and save to local JSON files
 */
async function downloadFromGoogleSheet() {
  if (!SHEET_ID) {
    console.error('Google Sheet ID not provided.');
    console.error('Make sure you have a .env file with GOOGLE_SHEET_ID.');
    return;
  }

  console.log('Downloading data from Google Sheet...');
  console.log(`Sheet ID: ${SHEET_ID}`);

  // Get the data directory
  const dataDir = path.join(process.cwd(), 'src', 'data');

  // Ensure the data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`Created data directory: ${dataDir}`);
  }

  // Process each category
  for (const category of categories) {
    try {
      console.log(`Downloading data for ${category}...`);
      
      // Public sheets can be accessed via this URL pattern
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${category}`;
      
      const response = await axios.get(url);
      
      // Google returns a weird format that we need to parse
      // It's like: google.visualization.Query.setResponse({...})
      const data = response.data.substring(
        response.data.indexOf('(') + 1,
        response.data.lastIndexOf(')')
      );
      
      const jsonData = JSON.parse(data);
      
      // Convert the Google Sheets format to our app format
      const items = [];
      const cols = jsonData.table.cols.map(col => col.label);
      
      jsonData.table.rows.forEach(row => {
        if (!row.c[0] || !row.c[0].v) return; // Skip empty rows
        
        const item = {};
        row.c.forEach((cell, i) => {
          if (cell && cols[i]) {
            item[cols[i]] = cell.v;
          }
        });
        
        items.push(item);
      });
      
      console.log(`Downloaded ${items.length} items for ${category}`);
      
      if (items.length > 0) {
        // Save to local file
        const filePath = path.join(dataDir, `${category}.json`);
        fs.writeFileSync(filePath, JSON.stringify({ items }, null, 2));
        console.log(`Saved data to ${filePath}`);
      } else {
        console.log(`No items found for ${category}. Skipping.`);
      }
    } catch (error) {
      console.error(`Error downloading data for ${category}:`, error.message);
    }
  }

  console.log('Download complete.');
}

// Run the download
downloadFromGoogleSheet().catch(error => {
  console.error('Download failed:', error);
});