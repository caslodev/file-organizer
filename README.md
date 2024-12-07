# File Organizer Script

This Node.js script organizes and renames files (e.g., images or videos) based on their date and time metadata. It supports adding suffixes to filenames and optionally adjusting the date and time.

## Features

- Scans a directory for files matching the `PXL_YYYYMMDD_HHMMSS` pattern.
- Creates folders for each unique date and organizes files accordingly.
- Adds optional suffixes to file names.
- Adjusts file timestamps by specified hours, minutes, or seconds.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the TypeScript script:
   ```bash
   npx tsc
   ```

## Usage

Run the script:
```bash
node dist/organizer.js
```

### Workflow

1. **Specify Source Folder**  
   Enter the folder containing the files you want to organize.  
   Example: `/path/to/source`.

2. **Specify Destination Folder**  
   Enter the folder where organized files will be stored. Press **Enter** to use the source folder.

3. **Add a Suffix** (Optional)  
   Enter a suffix to be added to filenames. Press **Enter** to skip.

4. **Adjust File Times** (Optional)  
   Choose to add or reduce time in hours, minutes, and seconds. Adjusted times are reflected in the file names.

5. **Confirm and Proceed**  
   Review the summary of folders to be created and filenames. Confirm to execute the operation.

### Example

#### Input

- Source folder: `/photos`
- Destination folder: `/organized_photos`
- Files:  
  - `PXL_20231207_123456001.JPG`  
  - `PXL_20231207_123457002.JPG`

#### Configuration

- Suffix: `_trip`
- Time Adjustment: Add 1 hour.

#### Output

- Folder `/organized_photos/20231207/`:
  - `PXL_20231207_133456001_trip.JPG`
  - `PXL_20231207_133457002_trip.JPG`

## Project Structure

```plaintext
project/
├── src/
│   └── organizer.ts    # Main script
├── dist/               # Compiled JavaScript files
├── package.json        # Node.js configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Scripts

- `node dist/organizer.js`: Runs the file organizer script.
- `npx tsc`: Compiles the TypeScript files.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributions

Contributions and suggestions are welcome! Feel free to fork the repository and submit a pull request.

---

**Happy Organizing!**
