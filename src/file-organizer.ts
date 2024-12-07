import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

interface FileDetails {
  date: string;
  originalName: string;
  newName: string;
  destination: string;
}

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt the user
const prompt = (question: string): Promise<string> =>
  new Promise((resolve) => rl.question(question, resolve));

// Function to adjust time in HHMMSS format
const adjustDateTime = (date: string, time: string, adjustment: number): { newDate: string, newTime: string } => {
  const year = parseInt(date.slice(0, 4), 10);
  const month = parseInt(date.slice(4, 6), 10) - 1; // JavaScript months are 0-indexed
  const day = parseInt(date.slice(6, 8), 10);

  const hours = parseInt(time.slice(0, 2), 10);
  const minutes = parseInt(time.slice(2, 4), 10);
  const seconds = parseInt(time.slice(4, 6), 10);

  // Create a Date object
  const dateObj = new Date(year, month, day, hours, minutes, seconds);

  // Apply time adjustment
  dateObj.setSeconds(dateObj.getSeconds() + adjustment);

  // Format the adjusted date and time back to strings
  const newYear = dateObj.getFullYear();
  const newMonth = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const newDay = String(dateObj.getDate()).padStart(2, "0");
  const newHours = String(dateObj.getHours()).padStart(2, "0");
  const newMinutes = String(dateObj.getMinutes()).padStart(2, "0");
  const newSeconds = String(dateObj.getSeconds()).padStart(2, "0");

  return {
    newDate: `${newYear}${newMonth}${newDay}`,
    newTime: `${newHours}${newMinutes}${newSeconds}`,
  };
};

(async () => {
  console.log("📂 File Organizer Script");

  // Prompt for the source folder
  const sourceFolder = await prompt("Enter the folder containing the files: ");

  if (!fs.existsSync(sourceFolder) || !fs.statSync(sourceFolder).isDirectory()) {
    console.log("❌ The specified folder does not exist or is not a directory.");
    rl.close();
    return;
  }

  // Prompt for the destination folder
  let destFolder = await prompt(
    "Enter the destination folder (press Enter to use the source folder): "
  );
  if (!destFolder) {
    destFolder = sourceFolder;
  }

  console.log("📂 Scanning for files...");

  const files = fs.readdirSync(sourceFolder).filter((file) => {
    const match = file.match(/^PXL_(\d{8})_(\d{9})/);
    return match && fs.statSync(path.join(sourceFolder, file)).isFile();
  });

  if (files.length === 0) {
    console.log("No valid image/video files found.");
    rl.close();
    return;
  }

  console.log(`Found ${files.length} files.`);
  const suffix = await prompt("Enter a suffix for the files (press Enter to skip): ");

  // ** NEW LOGIC FOR MODIFYING TIME STARTS HERE **
  const modifyTime = await prompt("Do you want to modify the file times? (yes/no): ");
  let totalAdjustment = 0;

  if (modifyTime.toLowerCase() === "yes") {
    // Ask whether to add or reduce time
    const action = await prompt("Do you want to add or reduce time? (add/reduce): ");
    const adjustmentType = action.toLowerCase() === "reduce" ? -1 : 1;

    // Ask for time adjustment in seconds
    const hours = parseInt(await prompt("Enter hours to adjust (0 for none): "), 10) || 0;
    const minutes = parseInt(await prompt("Enter minutes to adjust (0 for none): "), 10) || 0;
    const seconds = parseInt(await prompt("Enter seconds to adjust (0 for none): "), 10) || 0;

    totalAdjustment = adjustmentType * (hours * 3600 + minutes * 60 + seconds);

    console.log(`📂 Adjusting file times by ${totalAdjustment} seconds.`);
  }
  // ** NEW LOGIC FOR MODIFYING TIME ENDS HERE **

  // Group files by date
  const fileDetails: FileDetails[] = files.map((file) => {
    const match = file.match(/^PXL_(\d{8})_(\d{6})(\d{3})/);
    const date = match ? match[1] : "unknown";
    const time = match ? match[2] : "000000";

    let adjustedDate = date;
    let adjustedTime = time;

    // Apply date and time adjustment if requested
    if (modifyTime.toLowerCase() === "yes") {
      const adjusted = adjustDateTime(date, time, totalAdjustment);
      adjustedDate = adjusted.newDate;
      adjustedTime = adjusted.newTime;
    }

    const destination = path.join(destFolder, adjustedDate);
    const newName = suffix
      ? file.replace(/_(\d{8})_(\d{6})(\d{3})/, `_${adjustedDate}_${adjustedTime}$3_${suffix}`) // Add suffix after adjusted time
      : file.replace(/_(\d{8})_(\d{6})(\d{3})/, `_${adjustedDate}_${adjustedTime}$3`); // Only adjust date and time if no suffix

    return { date: adjustedDate, originalName: file, newName, destination };
  });


  // Print summary
  const folders = [...new Set(fileDetails.map((f) => f.date))];
  console.log(`The following folders will be created: ${folders.join(", ")}`);
  console.log(`Suffix to be used: "${suffix || "none"}"`);
  console.log(`Destination folder: ${destFolder}`);
  const confirm = await prompt("Do you want to proceed? (yes/no): ");

  if (confirm.toLowerCase() !== "yes") {
    console.log("Operation cancelled.");
    rl.close();
    return;
  }

  // Create folders and copy files
  fileDetails.forEach(({ date, originalName, newName, destination }) => {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const srcPath = path.join(sourceFolder, originalName);
    const destPath = path.join(destination, newName);

    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${originalName} to ${destPath}`);
  });

  console.log("✅ Files organized successfully.");
  rl.close();
})();
