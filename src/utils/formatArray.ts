export const formatArray = (array: unknown) => {
  if (!Array.isArray(array)) return array;
  if (new Set(array).size === 1) {
    return array[0];
  } else {
    return array;
  }
};
