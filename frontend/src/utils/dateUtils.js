/**
 * Utility functions for date and time formatting across the SkyConnect platform.
 */

/**
 * Formats an ISO datetime string to HH:MM format.
 * @param {string} dt - ISO datetime string
 * @returns {string} - Formatted time or "--:--"
 */
export const formatTime = (dt) => {
  if (!dt) return "--:--";
  // Expecting ISO string like "2026-06-01T10:00:00"
  try {
    return dt.split("T")[1].slice(0, 5);
  } catch (e) {
    return "--:--";
  }
};

/**
 * Formats an ISO datetime string to "D MMM" format (e.g., 1 Jun).
 * @param {string} dt - ISO datetime string
 * @returns {string} - Formatted date
 */
export const formatDate = (dt) => {
  if (!dt) return "";
  return new Date(dt).toLocaleDateString("en-IN", { 
    day: "numeric", 
    month: "short" 
  });
};

/**
 * Formats an ISO datetime string to "Day, D Month" format (e.g., Monday, 1 June).
 * @param {string} dt - ISO datetime string
 * @returns {string} - Formatted full date
 */
export const formatFullDate = (dt) => {
  if (!dt) return "";
  return new Date(dt).toLocaleDateString("en-IN", { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
};

/**
 * Calculates duration between two ISO datetime strings.
 * @param {string} dep - Departure ISO string
 * @param {string} arr - Arrival ISO string
 * @returns {string} - Duration in "Xh Ym" format
 */
export const calcDuration = (dep, arr) => {
  if (!dep || !arr) return "";
  const diff = (new Date(arr) - new Date(dep)) / 60000; // minutes
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${hours}h ${minutes}m`;
};
