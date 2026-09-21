export function FormatSize(bytes: number): string {
  if (bytes <= 0) return "0 KB";

  const units = ["KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)) - 1,
    units.length - 1,
  );
  const size = bytes / 1024 ** (unitIndex + 1);

  return `${Number(size.toFixed(2))} ${units[Math.max(unitIndex, 0)]}`;
}

export function generateUUID() {
  return crypto.randomUUID();
}
