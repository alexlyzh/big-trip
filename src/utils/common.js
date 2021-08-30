import {MILLISECONDS_IN_DAY, MILLISECONDS_IN_HOUR, MILLISECONDS_IN_MINUTE, UNIX_START_DAY} from '../constants';
import dayjs from 'dayjs';

const getRandomInteger = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomUniqueIntegerList = (min = 0, max = 1, length) => {
  const list = [];
  while (list.length !== length) {
    const number = getRandomInteger(min, max);
    if (!list.includes(number)) {
      list.push(number);
    }
  }
  return list;
};

const getTemplateFromItemsArray = (items = [], cb) => items.map((item) => cb(item)).join('');
const generateID = () => Math.random().toString(36).substr(2, 11);
const isEsc = (evt) => evt.keyCode === 27;

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const getDurationFormat = (milliseconds) => {
  let formatString;

  switch (true) {
    case milliseconds >= MILLISECONDS_IN_DAY:
      formatString = 'DD[D] HH[H] mm[M]';
      break;
    case milliseconds >= MILLISECONDS_IN_HOUR:
      formatString = 'HH[H] mm[M]';
      break;
    default:
      formatString = 'mm[M]';
  }

  return formatString;
};

const formatDuration = (duration) => {
  duration = duration + new Date(duration).getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
  return dayjs(duration).subtract(UNIX_START_DAY, 'day').format(getDurationFormat(duration));
};

export {isEsc, getRandomUniqueIntegerList, getRandomInteger, generateID, getTemplateFromItemsArray, capitalize, getDurationFormat, formatDuration};
