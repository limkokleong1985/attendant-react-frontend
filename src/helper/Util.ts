export function sortByArraySequence<T extends { id: number }, K extends { id: number }>(
  baseArray: T[],
  sortOrderArray: K[]
): T[] {
  const sortOrderMap = new Map<number, number>();

  sortOrderArray.forEach((item, index) => {
    sortOrderMap.set(item.id, index);
  });

  return baseArray.slice().sort((a, b) => {
    const aOrder = sortOrderMap.get(a.id) || 0;
    const bOrder = sortOrderMap.get(b.id) || 0;
    return aOrder - bOrder;
  });
}

export function updateArrayProperties<T extends { id: number }>(
  baseArray: T[],
  updateArray: T[],
  propertyNames: Array<keyof T>
): T[] {
  const propertyMaps: Map<number, any>[] = propertyNames.map(() => new Map<number, any>());

  updateArray.forEach((item) => {
    propertyNames.forEach((propertyName, propIndex) => {
      propertyMaps[propIndex].set(item.id, item[propertyName]);
    });
  });

  return baseArray.map((item) => {
    const newItem = { ...item };
    propertyNames.forEach((propertyName, propIndex) => {
      newItem[propertyName] = propertyMaps[propIndex].get(item.id) || newItem[propertyName];
    });
    return newItem;
  });
}
