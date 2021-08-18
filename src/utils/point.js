import dayjs from 'dayjs';
import {getRandomInteger} from './common.js';
import {
  EVENT_TYPES,
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_MINUTE,
  UNIX_START_DAY
} from '../constants.js';

const getRandomEventType = () => EVENT_TYPES[getRandomInteger(0, EVENT_TYPES.length - 1)];
const formatToFullDateAndTime = (date) => dayjs(date).format('YYYY-MM-DD[T]HH:mm');
const formatToFullDate = (date) => dayjs(date).format('YYYY-MM-DD');
const formatToMonthAndDay = (date) => dayjs(date).format('MMM DD');
const formatToHoursAndMin = (date) => dayjs(date).format('HH:mm');
const formatToEditEventFormDatetime = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const getDuration = (from, to) => {
  let duration = dayjs(to).diff(dayjs(from), 'millisecond');
  let formatString;

  switch (true) {
    case duration >= MILLISECONDS_IN_DAY:
      formatString = 'DD[D] HH[H] mm[M]';
      break;
    case duration >= MILLISECONDS_IN_HOUR:
      formatString = 'HH[H] mm[M]';
      break;
    default:
      formatString = 'mm[M]';
  }
  duration = duration + new Date(duration).getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
  return dayjs(duration).subtract(UNIX_START_DAY, 'day').format(formatString);
};

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const sortPriceDescending = (a, b) => b.basePrice - a.basePrice;

const sortDurationDescending = (a, b) => dayjs(b.dateTo).diff(b.dateFrom, 'millisecond') - dayjs(a.dateTo).diff(a.dateFrom, 'millisecond');

export {
  capitalize,
  getDuration,
  formatToEditEventFormDatetime,
  formatToHoursAndMin,
  formatToMonthAndDay,
  formatToFullDate,
  formatToFullDateAndTime,
  getRandomEventType,
  sortPriceDescending,
  sortDurationDescending
};
