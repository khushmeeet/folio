/**
 * Format date string in a nerdy way (ISO format with space instead of T)
 * @param dateString The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().replace('T', ' ').substring(0, 19);
}