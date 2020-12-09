export const getObjName = (item: any): string => {
  if (item.name) {
    return item.name;
  }

  if (item.constructor?.name) {
    return item.constructor.name;
  }

  return '';
};
