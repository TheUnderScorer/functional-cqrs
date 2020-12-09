export const getName = (item: any): string => {
  if (typeof item === 'string') {
    return item;
  }

  if (item.name) {
    return item.name;
  }

  if (item.constructor?.name) {
    return item.constructor.name;
  }

  return '';
};
