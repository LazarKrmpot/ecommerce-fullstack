export const findDeep = (obj: object, key: string) => {
  const results = [];

  const searchForObject = (obj: object, key: string) => {
    if (!obj || (typeof obj !== 'object' && !Array.isArray(obj))) {
      return;
      // eslint-disable-next-line no-prototype-builtins
    } else if (obj.hasOwnProperty(key)) {
      results.push(obj[key]);
    } else if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        searchForObject(obj[i], key);
      }
    } else {
      for (const k in obj) {
        searchForObject(obj[k], key);
      }
    }
  };

  searchForObject(obj, key);
  return results;
};
