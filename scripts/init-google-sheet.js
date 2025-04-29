const fs = require('fs');
const path = require('path');
const axios = require('axios');

// The categories to initialize
const categories = ['restaurants', 'bars', 'cafes', 'movies', 'shows', 'date-ideas'];

// The Google Sheet ID and Apps Script URL from environment variables
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

/**
 * Initialize the Google Sheet with data from local JSON files
 */
async function initializeGoogleSheet() {
  if (!SHEET_ID || !APPS_SCRIPT_URL) {
    console.error('Google Sheet ID or Apps Script URL not provided. Skipping initialization.');
    return;
  }

  console.log('Initializing Google Sheet with local data...');

  // Get the data directory
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'src', 'data');

  // Process each category
  for (const category of categories) {
    try {
      // Check if the JSON file exists
      const filePath = path.join(dataDir, `${category}.json`);
      if (!fs.existsSync(filePath)) {
        console.log(`No data file found for ${category}. Skipping.`);
        continue;
      }

      // Read the data from the file
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      if (!fileData.items || !Array.isArray(fileData.items) || fileData.items.length === 0) {
        console.log(`No items found for ${category}. Skipping.`);
        continue;
      }

      // Save the data to Google Sheets
      console.log(`Uploading ${fileData.items.length} items for ${category}...`);
      
      await axios.post(APPS_SCRIPT_URL, {
        category,
        data: fileData.items,
        sheetId: SHEET_ID
      });

      console.log(`Successfully uploaded data for ${category}.`);
    } catch (error) {
      console.error(`Error initializing ${category}:`, error.message);
    }
  }

  console.log('Google Sheet initialization complete.');
}

// Run the initialization
initializeGoogleSheet().catch(error => {
  console.error('Initialization failed:', error);
  process.exit(1);
});