import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import AdmZip from 'adm-zip';

async function restoreFromDrive() {
  try {
    console.log('Starting restore from Google Drive...');
    
    // File ID in Google Drive
    const fileId = process.env.GOOGLE_DRIVE_FILE_ID;
    if (!fileId) {
      console.log('No Google Drive file ID provided, skipping restore');
      return false;
    }
    
    // Path to your data directory
    const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'src', 'data');
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Authenticate with Google
    const auth = await authenticate({
      keyfilePath: path.join(process.cwd(), 'credentials.json'),
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    
    const drive = google.drive({ version: 'v3', auth });
    
    // Download from Google Drive
    const tempZipPath = path.join(process.cwd(), 'temp-restore.zip');
    const dest = fs.createWriteStream(tempZipPath);
    
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    
    await new Promise((resolve, reject) => {
      response.data
        .on('end', () => {
          console.log('Downloaded backup file from Google Drive');
          resolve();
        })
        .on('error', err => {
          console.error('Error downloading file');
          reject(err);
        })
        .pipe(dest);
    });
    
    // Extract the zip file
    const zip = new AdmZip(tempZipPath);
    zip.extractAllTo(dataDir, true);
    
    // Clean up
    fs.unlinkSync(tempZipPath);
    console.log('Restore completed successfully');
    
    return true;
  } catch (error) {
    console.error('Error restoring from Google Drive:', error);
    // Don't throw, just return false to allow fallback to default data
    return false;
  }
}

// Run the restore
restoreFromDrive().catch(console.error);