# Hydra List

A simple web application for creating and sharing lists of activities, restaurants, travel destinations, and more with your partner. Track your experiences, rate items, and randomly select activities to try next.

## Features

- Multiple list categories (restaurants, bars, cafes, movies, shows, date ideas)
- Add items with images, links, and descriptions
- Rate items from 0-5 stars
- Add review notes after completing activities
- Random selection feature to help you decide what to do next
- Google Sheets integration for data storage and sharing
- Docker support for easy deployment

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) (included with Node.js)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- A Google account (optional, for Google Sheets integration)

## First Steps After Cloning

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```
# Required for Google Sheets integration (optional)
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_APPS_SCRIPT_URL=your_google_apps_script_url

# Optional configuration
DATA_DIR=./src/data
```

### 3. Initialize Data Files

The application uses JSON files to store data. Sample data files are included in the `src/data` directory. You can modify these files or create new ones for each category:

- `restaurants.json`
- `bars.json`
- `cafes.json`
- `movies.json`
- `shows.json`
- `date-ideas.json`

Each file should follow this structure:

```json
{
  "items": [
    {
      "id": "unique-id-1",
      "name": "Item Name",
      "description": "Description of the item",
      "image": "https://example.com/image.jpg",
      "link": "https://example.com",
      "rating": 4.5,
      "notes": "Your review notes here",
      "completed": true,
      "dateAdded": "2025-04-29T12:00:00Z"
    }
  ]
}
```

## Running the Application

### Local Development

To run the application in development mode:

```bash
npm run dev
```

This will start the Next.js development server at [http://localhost:3000](http://localhost:3000).

### Production Build

To create a production build and run it:

```bash
npm run build
npm start
```

### Using Docker

The easiest way to run the application with Docker:

```bash
npm run docker
```

This will:
1. Build the Next.js application locally
2. Build the Docker image
3. Start the Docker container

You can then access the application at [http://localhost:3000](http://localhost:3000).

#### Individual Docker Commands

If you prefer more control:

```bash
# Build the Docker image
npm run docker:build

# Start the Docker container
npm run docker:up

# Stop the Docker container
npm run docker:down
```

## Google Sheets Integration

Hydra List can use Google Sheets as a database, allowing you to share your lists with others and access them from anywhere.

### Setting Up Google Sheets Integration

1. **Create a Google Sheet**:
   - Create a new Google Sheet
   - Make it publicly accessible for viewing (Share > Anyone with the link > Viewer)
   - Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

2. **Deploy the Google Apps Script**:
   - Go to [Google Apps Script](https://script.google.com/)
   - Create a new project
   - Copy the content of `scripts/google-apps-script.js` into the editor
   - Deploy as a web app:
     - Click Deploy > New deployment
     - Select type: Web app
     - Execute as: Me
     - Who has access: Anyone
     - Click Deploy
   - Copy the web app URL

3. **Update Your .env File**:
   ```
   GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_APPS_SCRIPT_URL=your_web_app_url_here
   ```

### Syncing Data with Google Sheets

```bash
# Upload local data to Google Sheets
npm run upload-to-sheets

# Download data from Google Sheets to local files
npm run download-from-sheets

# Two-way sync (upload then download)
npm run sync-sheets
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build the application |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run upload-to-sheets` | Upload local data to Google Sheets |
| `npm run download-from-sheets` | Download data from Google Sheets |
| `npm run sync-sheets` | Two-way sync with Google Sheets |
| `npm run docker:build` | Build Docker image |
| `npm run docker:up` | Start Docker container |
| `npm run docker:down` | Stop Docker container |
| `npm run docker` | Build and start Docker container |

## Troubleshooting

### Google Sheets Integration Issues

- **Sheet Not Found**: Make sure your Google Sheet ID is correct and the sheet is publicly accessible
- **Apps Script Error**: Verify that your Apps Script is deployed as a web app and the URL is correct
- **Authentication Error**: Ensure your Google Sheet is accessible to anyone with the link

### Docker Issues

- **Build Errors**: Try running `npm run build` locally first to identify any build issues
- **Container Not Starting**: Check Docker logs with `docker-compose logs`
- **Data Not Persisting**: Verify that the Docker volume is properly mounted

### Local Development Issues

- **Missing Dependencies**: Run `npm install` to ensure all dependencies are installed
- **Data Not Loading**: Check that your JSON files exist in the `src/data` directory
- **API Errors**: Verify that your `.env` file is properly configured

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
