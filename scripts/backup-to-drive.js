import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import AdmZip from 'adm-zip';

// File ID in Google Drive (will be created on first run)
let fileId = process.env.GOOGLE_DRIVE_FILE_ID || '';

async function backupToDrive() {
  try {
    console.log('Starting backup to Google Drive...');
    
    // Path to your data directory
    const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'src', 'data');
    
    // Create a zip file of all data
    const zip = new AdmZip();
    
    // Add all JSON files from the data directory
    const files = fs.readdirSync(dataDir);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(dataDir, file);
        zip.addLocalFile(filePath);
      }
    });
    
    // Generate the zip file
    const zipBuffer = zip.toBuffer();
    const tempZipPath = path.join(process.cwd(), 'temp-backup.zip');
    fs.writeFileSync(tempZipPath, zipBuffer);
    
    // Authenticate with Google
    const auth = await authenticate({
      keyfilePath: path.join(process.cwd(), 'credentials.json'),
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    
    const drive = google.drive({ version: 'v3', auth });
    
    // Upload to Google Drive
    let response;
    if (fileId) {
      // Update existing file
      response = await drive.files.update({
        fileId,
        media: {
          body: fs.createReadStream(tempZipPath),
        },
      });
      console.log('Updated existing backup file on Google Drive');
    } else {
      // Create new file
      response = await drive.files.create({
        requestBody: {
          name: 'hydra-list-backup.zip',
          mimeType: 'application/zip',
        },
        media: {
          body: fs.createReadStream(tempZipPath),
        },
      });
      fileId = response.data.id;
      console.log(`Created new backup file on Google Drive with ID: ${fileId}`);
      console.log('Set this ID as GOOGLE_DRIVE_FILE_ID in your .env file');
    }
    
    // Clean up
    fs.unlinkSync(tempZipPath);
    console.log('Backup completed successfully');
    
    return fileId;
  } catch (error) {
    console.error('Error backing up to Google Drive:', error);
    throw error;
  }
}

// Run the backup
backupToDrive().catch(console.error);