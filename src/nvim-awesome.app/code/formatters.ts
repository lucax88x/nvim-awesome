export const formatNumberAsString = (number: number) =>
  number.toLocaleString(undefined, { maximumFractionDigits: 2 });
