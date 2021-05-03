import { isEqual, isValid, isBefore } from 'date-fns';

export const isValidDate = (date: Date) => isValid(date);

export const minDate = new Date('0001-01-01T00:00:00+00:00');

export const isMinDate = (date: Date) =>
  isBefore(date, minDate) || isEqual(date, minDate);

