function removeKeysFromObject(obj, keys) {
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
}

// Example usage:
const myObj = {
  user: {
    name: 'John',
    address: {
      street: '123 Main St',
      city: 'New York',
    },
  },
  age: 30,
  email: 'john@example.com',
};

// Remove both nested and non-nested keys
removeKeysFromObject(myObj, [['user', 'address'], 'age']);

console.log(myObj);
// Output: { user: { name: 'John', address: { city: 'New York' } } }
