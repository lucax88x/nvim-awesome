export function getRandom<T>(arr: T[], count: number) {
  let counter = count;
  let len = arr.length;

  const result = new Array<T>(count);
  const taken = new Array<number>(len);

  if (counter > len)
    throw new RangeError('getRandom: more elements taken than available');

  // eslint-disable-next-line no-plusplus
  while (counter--) {
    const x = Math.floor(Math.random() * len);
    result[counter] = arr[x in taken ? taken[x] : x];
    // eslint-disable-next-line no-plusplus
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}
