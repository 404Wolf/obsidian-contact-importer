import { createHash } from "crypto";
import { join } from "path";

export async function readFile(path: string): Promise<string> {
  return await Bun.file(path).text();
}

export async function writeFile(path: string, content: string): Promise<void> {
  try {
    await Bun.write(path, content);
    console.log(`File saved successfully to ${path}`);
  } catch (error) {
    console.error("Error saving the file:", error);
    throw error;
  }
}
export async function getB64Hash(b64: string): Promise<string> {
  return createHash("sha256").update(b64).digest("hex");
}
export async function saveBase64ImageToFile(
  base64Image: string,
  outputFolder: string,
): Promise<string> {
  // Remove the data URL prefix if present
  const base64Data = base64Image.replace(/^data:image\/(\w+);base64,/, "");

  // Extract the file extension from the data URL
  const fileExtension = base64Image.match(/^data:image\/(\w+);base64,/)?.[1];
  if (fileExtension === undefined) throw new Error("Malformed b64");

  // Generate SHA-256 hash of the base64 data
  const hash = await getB64Hash(base64Data);

  // Create the filename
  const filename = `${hash.slice(0, 12)}.${fileExtension}`;

  // Create the full output path
  const outputPath = join(outputFolder, filename);

  // Decode the base64 string to a buffer
  const imageBuffer = Buffer.from(base64Data, "base64");

  try {
    // Write the buffer to a file
    await Bun.write(outputPath, imageBuffer);
    console.log(`Image saved successfully to ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error("Error saving the image:", error);
    throw error;
  }
}

export function formatDate(dateString: string): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [year, month, day] = dateString.split("-");
  const monthIndex = parseInt(month, 10) - 1; // Subtract 1 as array is 0-indexed

  return `${months[monthIndex]} ${parseInt(day, 10)}, ${year}`;
}
