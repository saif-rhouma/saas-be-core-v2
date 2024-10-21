/* eslint-disable prettier/prettier */

/**
 *
 * @param obj:Object
 * @param keys:Array<string>
 * @returns Object with removed keys
 */
export const deleteKeysFromObj = (obj, keys) => {
  if (!obj || typeof obj !== 'object' || !keys || !Array.isArray(keys)) {
    return;
  }

  keys.forEach((keyPath) => {
    let current = obj;
    const path = Array.isArray(keyPath) ? keyPath : [keyPath]; // Handle non-nested keys as well

    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]] && typeof current[path[i]] === 'object') {
        current = current[path[i]];
      } else {
        return; // Key path doesn't exist, exit early
      }
    }

    // Delete the final key in the path
    delete current[path[path.length - 1]];
  });
};
