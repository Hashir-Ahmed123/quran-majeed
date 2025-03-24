
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // If the date is invalid, return original string
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  // Format: May 20, 2023
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}
