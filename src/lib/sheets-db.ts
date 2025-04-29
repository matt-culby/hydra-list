import axios from 'axios';

// The ID of your Google Sheet
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

/**
 * Load data from a specific sheet (category)
 */
export async function loadFromSheet(category: string) {
  try {
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
    const items: Array<Record<string, unknown>> = [];
    const cols = jsonData.table.cols.map((col: { label: string }) => col.label);
    
    jsonData.table.rows.forEach((row: { c: Array<{ v: unknown } | null> }) => {
      if (!row.c[0] || !row.c[0].v) return; // Skip empty rows
      
      const item: Record<string, unknown> = {};
      row.c.forEach((cell: { v: unknown } | null, i: number) => {
        if (cell && cols[i]) {
          item[cols[i]] = cell.v;
        }
      });
      
      items.push(item);
    });
    
    console.log(`Loaded ${items.length} items from Google Sheet for category: ${category}`);
    return { items };
  } catch (error) {
    console.error(`Error loading data from sheet ${category}:`, error);
    return { items: [] };
  }
}

/**
 * Save data to a sheet using Google Apps Script
 */
export async function saveToSheet(category: string, data: { items: Array<Record<string, unknown>> }) {
  try {
    // For this to work, you need to deploy a Google Apps Script web app
    // that accepts POST requests and updates your sheet
    const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
    
    if (!APPS_SCRIPT_URL) {
      console.error('No Google Apps Script URL provided');
      return false;
    }
    
    await axios.post(APPS_SCRIPT_URL, {
      category,
      data: data.items,
      sheetId: SHEET_ID
    });
    
    console.log(`Saved ${data.items.length} items to Google Sheet for category: ${category}`);
    return true;
  } catch (error) {
    console.error(`Error saving data to sheet ${category}:`, error);
    return false;
  }
}

/**
 * Check if Google Sheets integration is configured
 */
export function isSheetsConfigured(): boolean {
  return Boolean(SHEET_ID && process.env.GOOGLE_APPS_SCRIPT_URL);
}