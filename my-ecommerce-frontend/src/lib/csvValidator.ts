export interface CsvValidationResult {
  isValid: boolean;
  productCount: number;
}

export function validateCsvHeaders(
  csvContent: string,
  requiredHeaders: string[]
): CsvValidationResult {
  // Get all lines of the CSV file
  const lines = csvContent.split("\n");
  if (lines.length === 0) {
    return { isValid: false, productCount: 0 };
  }

  // Parse the headers from the first line
  const firstLine = lines[0].trim();
  const headers = firstLine
    .split(",")
    .map((header) => header.trim().toLowerCase());

  // Check if all required headers are present
  const isValid = requiredHeaders.every((requiredHeader) =>
    headers.includes(requiredHeader.toLowerCase())
  );

  // Count products (excluding header row and empty lines)
  const productCount = lines
    .slice(1)
    .filter((line) => line.trim().length > 0).length;

  return { isValid, productCount };
}
