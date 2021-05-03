import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addYears,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
  format,
  isBefore,
  parseISO,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subYears,
} from 'date-fns';
import Decimal from 'decimal.js';
import { isString } from './is';
import { isMinDate, isValidDate } from './is-date';

export const minDate = new Date(0);
export const maxDate = new Date(7289650740000);

const dateFormatAsDateTime = 'dd/MM/yyyy HH:mm';
const dateFormatAsDate = 'dd/MM/yyyy';
const dateFormatAsShortMonth = 'MMM dd';
// toISOString for iso

const formatDateByFormat = (dateFormat: string) => (date: Date | string) => {
  let correctDate: Date;
  if (isString(date)) {
    correctDate = parseISO(date);
  } else {
    correctDate = date;
  }

  if (isValidDate(correctDate)) {
    if (isMinDate(correctDate)) {
      return 'No Date';
    }
    return format(correctDate, dateFormat);
  }

  return 'Invalid Date';
};

const HOURS_IN_DAY = new Decimal(24);
const MINUTES_IN_HOUR = new Decimal(60);
const SECONDS_IN_MINUTE = new Decimal(60);
const SECONDS_IN_HOUR = MINUTES_IN_HOUR.mul(SECONDS_IN_MINUTE);
const SECONDS_IN_DAY = SECONDS_IN_HOUR.mul(HOURS_IN_DAY);
const DAYS_IN_MONTH = new Decimal(30);
const DAYS_IN_YEAR = new Decimal(365);
const SECONDS_IN_YEAR = SECONDS_IN_DAY.mul(DAYS_IN_YEAR);

const dateDifference = (left: Date, right: Date) => {
  let difference = new Date(0);
  let toUpdateRight = right;

  const years = differenceInYears(toUpdateRight, left);
  if (years > 0) {
    toUpdateRight = subYears(toUpdateRight, years);
    difference = addYears(difference, years);
  }

  const months = differenceInMonths(toUpdateRight, left);
  if (months > 0) {
    toUpdateRight = subMonths(toUpdateRight, months);
    difference = addMonths(difference, months);
  }

  const days = differenceInDays(toUpdateRight, left);
  if (days > 0) {
    toUpdateRight = subDays(toUpdateRight, days);
    difference = addDays(difference, days);
  }

  const hours = differenceInHours(toUpdateRight, left);
  difference = addHours(difference, hours);
  toUpdateRight = subHours(toUpdateRight, hours);

  const minutes = differenceInMinutes(toUpdateRight, left);
  difference = addMinutes(difference, minutes);
  toUpdateRight = subMinutes(toUpdateRight, minutes);

  return difference;
};

const dateToMinutes = (date: Date): Decimal => {
  let totalMinutes = new Decimal(0);

  const minutes = differenceInMinutes(date, minDate);
  if (minutes > 0) {
    totalMinutes = totalMinutes.plus(minutes);
  }
  return totalMinutes;
};

const minutesToHuman = (totalMinutes: Decimal) => {
  const totalSeconds = totalMinutes.mul(SECONDS_IN_MINUTE);

  const secondsInDay = SECONDS_IN_DAY;
  const secondsInMonth = secondsInDay.mul(DAYS_IN_MONTH);
  const secondsInYear = secondsInDay.mul(DAYS_IN_YEAR);
  const years = totalSeconds.div(secondsInYear).floor();
  const months = totalSeconds.div(secondsInMonth).floor();
  const days = totalSeconds.mod(secondsInYear).div(secondsInDay).floor();
  const hours = totalSeconds
    .mod(secondsInYear)
    .mod(secondsInDay)
    .div(SECONDS_IN_HOUR)
    .floor();
  const minutes = totalSeconds
    .mod(SECONDS_IN_YEAR)
    .mod(secondsInDay)
    .mod(SECONDS_IN_HOUR)
    .div(SECONDS_IN_MINUTE)
    .floor();

  if (years.greaterThan(0)) {
    if (years.equals(1)) {
      return `${years.toNumber()} year ago`;
    } 
      return `${years.toNumber()} years ago`;
    
  }

  if (months.greaterThan(0)) {
    if (months.equals(1)) {
      return `${months.toNumber()} month ago`;
    } 
      return `${months.toNumber()} months ago`;
    
  }
  if (days.greaterThan(0)) {
    if (days.equals(1)) {
      return `${days.toNumber()} day ago`;
    } 
      return `${days.toNumber()} days ago`;
    
  }
  if (hours.greaterThan(0)) {
    if (hours.equals(1)) {
      return `${hours.toNumber()} hour ago`;
    } 
      return `${hours.toNumber()} hours ago`;
    
  }
  if (minutes.greaterThan(0)) {
    if (minutes.equals(1)) {
      return `${minutes.toNumber()} minute ago`;
    } 
      return `${minutes.toNumber()} minutes ago`;
    
  }

  return 'unknown';
};

export const formatDateAsDateTime = formatDateByFormat(dateFormatAsDateTime);
export const formatDateAsDate = formatDateByFormat(dateFormatAsDate);
export const formatDateAsShortMonth = formatDateByFormat(
  dateFormatAsShortMonth,
);

export const humanDifferenceFromDates = (
  left: Date | string,
  right: Date | string,
) => {
  let difference: Date;
  let toUseRight = right;
  let toUseLeft = left;

  if (isString(toUseLeft)) {
    toUseLeft = new Date(toUseLeft);
  }
  if (isString(toUseRight)) {
    toUseRight = new Date(toUseRight);
  }

  if (isBefore(toUseLeft, toUseRight)) {
    difference = dateDifference(toUseLeft, toUseRight);
  } else {
    throw Error('invalid dates');
  }

  const totalMinutes = dateToMinutes(difference);
  return minutesToHuman(totalMinutes);
};
