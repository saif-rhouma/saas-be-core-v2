/* eslint-disable prettier/prettier */

//-------------------------------------------------------
/**
 *
 * @param dateTime
 * @returns true if it's in the past
 */
export function isDateTimeInPast(dateTime: Date): boolean {
  const now = new Date(); // Get the current date and time
  const inputDateTime = new Date(dateTime); // Convert the input to a Date object

  return inputDateTime < now; // Check if the input date is in the past
}
//-------------------------------------------------------
