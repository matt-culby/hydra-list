const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// The Google Sheet ID and Apps Script URL from environment variables
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

/**
 * Upload cafes data to Google Sheets
 */
async function fixCafesData() {
  if (!SHEET_ID || !APPS_SCRIPT_URL) {
    console.error('Google Sheet ID or Apps Script URL not provided.');
    console.error('Make sure you have a .env file with GOOGLE_SHEET_ID and GOOGLE_APPS_SCRIPT_URL.');
    return;
  }

  console.log('Uploading fixed cafes data to Google Sheet...');
  console.log(`Sheet ID: ${SHEET_ID}`);
  console.log(`Apps Script URL: ${APPS_SCRIPT_URL}`);

  try {
    // Read the cafes data file
    const dataDir = path.join(process.cwd(), 'src', 'data');
    const filePath = path.join(dataDir, 'cafes.json');
    
    if (!fs.existsSync(filePath)) {
      console.error(`Cafes data file not found: ${filePath}`);
      return;
    }

    // Read the data from the file
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    if (!fileData.items || !Array.isArray(fileData.items) || fileData.items.length === 0) {
      console.error('No items found in cafes data file.');
      return;
    }

    // Save the data to Google Sheets
    console.log(`Uploading ${fileData.items.length} cafes items...`);
    
    try {
      const response = await axios.post(APPS_SCRIPT_URL, {
        category: 'cafes',
        data: fileData.items,
        sheetId: SHEET_ID
      });
      
      console.log('Response:', response.data);
      console.log('Successfully uploaded cafes data.');
    } catch (error) {
      console.error('Error uploading cafes data:', error.response?.data || error.message);
    }
  } catch (error) {
    console.error('Error processing cafes data:', error.message);
  }
}

// Run the fix
fixCafesData().catch(error => {
  console.error('Fix failed:', error);
});