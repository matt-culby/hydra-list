/**
 * This is the Google Apps Script code that should be deployed as a web app.
 * It handles saving data to Google Sheets, properly updating existing items.
 * 
 * To use this:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Copy this entire file into the editor
 * 4. Deploy as a web app (Deploy > New deployment > Web app)
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the web app URL and set it as GOOGLE_APPS_SCRIPT_URL in your .env file
 */

// The ID field used to identify items
const ID_FIELD = 'id';

/**
 * Process POST requests
 */
function doPost(e) {
  try {
    // Parse the request data
    const data = JSON.parse(e.postData.contents);
    const { category, data: items, sheetId } = data;
    
    if (!category || !items || !Array.isArray(items)) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Invalid request data'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    
    // Get or create the sheet for this category
    let sheet = spreadsheet.getSheetByName(category);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(category);
    }
    
    // Process the data
    const result = saveData(sheet, items);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: `Processed ${items.length} items for ${category}`,
      updated: result.updated,
      added: result.added
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Save data to the sheet, updating existing items and adding new ones
 */
function saveData(sheet, items) {
  // Get all existing data
  const existingData = getSheetData(sheet);
  
  // Track stats
  const result = {
    updated: 0,
    added: 0
  };
  
  // If sheet is empty, initialize with headers
  if (existingData.length === 0) {
    // Create headers from the first item
    if (items.length > 0) {
      const headers = Object.keys(items[0]);
      sheet.appendRow(headers);
    } else {
      // No items to add
      return result;
    }
    
    // Get the data again to include headers
    existingData.push(getSheetData(sheet)[0]);
  }
  
  // Get the headers
  const headers = existingData[0];
  
  // Process each item
  items.forEach(item => {
    // Check if item has an ID
    if (!item[ID_FIELD]) {
      // Generate a random ID if none exists
      item[ID_FIELD] = Utilities.getUuid();
    }
    
    // Find the item in existing data
    const existingIndex = findItemIndex(existingData, item[ID_FIELD]);
    
    if (existingIndex > 0) {
      // Update existing item
      updateItem(sheet, existingIndex, item, headers);
      result.updated++;
    } else {
      // Add new item
      addItem(sheet, item, headers);
      result.added++;
    }
  });
  
  return result;
}

/**
 * Get all data from the sheet as an array of arrays
 */
function getSheetData(sheet) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  
  if (lastRow === 0 || lastColumn === 0) {
    return [];
  }
  
  return sheet.getRange(1, 1, lastRow, lastColumn).getValues();
}

/**
 * Find an item by ID in the sheet data
 * Returns the row index (1-based) or -1 if not found
 */
function findItemIndex(data, id) {
  // Find the ID column
  const headers = data[0];
  const idColumnIndex = headers.indexOf(ID_FIELD);
  
  if (idColumnIndex === -1) {
    return -1;
  }
  
  // Look for the ID in the data
  for (let i = 1; i < data.length; i++) {
    if (data[i][idColumnIndex] === id) {
      return i + 1; // +1 because sheet rows are 1-based
    }
  }
  
  return -1;
}

/**
 * Update an existing item in the sheet
 */
function updateItem(sheet, rowIndex, item, headers) {
  // Create an array of values in the same order as headers
  const values = headers.map(header => {
    return item[header] !== undefined ? item[header] : '';
  });
  
  // Update the row
  sheet.getRange(rowIndex, 1, 1, values.length).setValues([values]);
}

/**
 * Add a new item to the sheet
 */
function addItem(sheet, item, headers) {
  // Create an array of values in the same order as headers
  const values = headers.map(header => {
    return item[header] !== undefined ? item[header] : '';
  });
  
  // Append the row
  sheet.appendRow(values);
}

/**
 * Handle GET requests (for testing)
 */
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Google Apps Script is running'
  })).setMimeType(ContentService.MimeType.JSON);
}