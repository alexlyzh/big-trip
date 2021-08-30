import dayjs from 'dayjs';
import {formatDuration, getRandomInteger} from './common.js';
import {EVENT_TYPES} from '../constants.js';

const getRandomEventType = () => EVENT_TYPES[getRandomInteger(0, EVENT_TYPES.length - 1)];
const formatToFullDateAndTime = (date) => dayjs(date).format('YYYY-MM-DD[T]HH:mm');
const formatToFullDate = (date) => dayjs(date).format('YYYY-MM-DD');
const formatToMonthAndDay = (date) => dayjs(date).format('MMM DD');
const formatToHoursAndMin = (date) => dayjs(date).format('HH:mm');
const formatToEditEventFormDatetime = (date) => dayjs(date).format('DD/MM/YYYY HH:mm');

const getDuration = (from, to) => {
  const duration = dayjs(to).diff(dayjs(from), 'millisecond');
  return formatDuration(duration);
};

const sortDayAscending = (a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom);
const sortPriceDescending = (a, b) => b.basePrice - a.basePrice;
const sortDurationDescending = (a, b) => dayjs(b.dateTo).diff(b.dateFrom, 'millisecond') - dayjs(a.dateTo).diff(a.dateFrom, 'millisecond');

const isExpired = (point) => new Date(point.dateFrom) < new Date();

const isHappeningNow = (point) => {
  const now = new Date();
  return new Date(point.dateFrom) <= now && new Date(point.dateTo) > now;
};

export {
  getDuration,
  formatToEditEventFormDatetime,
  formatToHoursAndMin,
  formatToMonthAndDay,
  formatToFullDate,
  formatToFullDateAndTime,
  getRandomEventType,
  sortDayAscending,
  sortPriceDescending,
  sortDurationDescending,
  isExpired,
  isHappeningNow
};
