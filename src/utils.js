import dayjs from 'dayjs';
import {EVENT_TYPES} from './constants';

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

const getRandomEventType = () => EVENT_TYPES[getRandomInteger(0, EVENT_TYPES.length - 1)];

const formatToFullDateAndTime = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');
const formatToFullDate = (date) => dayjs(date).format('YYYY-MM-DD');
const formatToMonthAndDay = (date) => dayjs(date).format('MMM DD');
const formatToHoursAndMin = (date) => dayjs(date).format('HH:mm');

const getDuration = (to, from) => {
  const duration = dayjs(to).diff(dayjs(from), 'minutes');
  return dayjs.unix(duration);
};


const getTemplateFromItemsArray = (items, cb) => {
  if (!items) {
    return '';
  }
  return items.map((item) => cb(item)).join('');
};

export {
  getRandomInteger,
  getRandomUniqueIntegerList,
  formatToFullDateAndTime,
  formatToFullDate,
  formatToMonthAndDay,
  formatToHoursAndMin,
  getDuration,
  getTemplateFromItemsArray,
  getRandomEventType
};
