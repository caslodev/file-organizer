import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt the user
const prompt = (question: string): Promise<string> =>
  new Promise((resolve) => rl.question(question, resolve));

(async () => {
  console.log("📂 File Copy Script");

  // Prompt for the source folder
  const sourceFolder = await prompt("Enter the folder containing the files: ");

  if (!fs.existsSync(sourceFolder) || !fs.statSync(sourceFolder).isDirectory()) {
    console.log("❌ The specified folder does not exist or is not a directory.");
    rl.close();
    return;
  }

  // Prompt for the destination folder
  const destFolder = await prompt("Enter the destination folder: ");

  if (!fs.existsSync(destFolder)) {
    console.log("❌ The specified destination folder does not exist.");
    rl.close();
    return;
  }

  // Scan the source folder for matching files
  console.log("📂 Scanning for files...");
  const files = fs.readdirSync(sourceFolder).filter((file) => {
    return /^P\d+\.JPG$/.test(file) && fs.statSync(path.join(sourceFolder, file)).isFile();
  });

  if (files.length === 0) {
    console.log("❌ No valid files found matching the pattern P[\\d]+.JPG.");
    rl.close();
    return;
  }

  console.log(`Found ${files.length} files.`);
  const suffix = await prompt("Enter a suffix for the files (press Enter to skip): ");

  // Copy files to the destination with the new names
  files.forEach((file) => {
    const ext = path.extname(file); // Get file extension
    const baseName = path.basename(file, ext); // Get base file name without extension
    const newName = suffix ? `${baseName}_${suffix}${ext}` : file; // Append suffix if provided
    const srcPath = path.join(sourceFolder, file); // Source path
    const destPath = path.join(destFolder, newName); // Destination path

    // Copy the file
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to ${destPath}`);
  });

  console.log("✅ Files copied successfully.");
  rl.close();
})();
