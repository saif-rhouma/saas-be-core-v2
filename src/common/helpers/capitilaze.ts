/* eslint-disable prettier/prettier */
export function capitalizeEachWord(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
