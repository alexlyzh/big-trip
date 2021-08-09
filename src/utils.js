import dayjs from 'dayjs';
import {EVENT_TYPES, UNIX_START_DAY, MILLISECONDS_IN_DAY, MILLISECONDS_IN_HOUR, MILLISECONDS_IN_MINUTE} from './constants.js';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

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

const isEsc = (evt) => evt.keyCode === 27;

const getRandomEventType = () => EVENT_TYPES[getRandomInteger(0, EVENT_TYPES.length - 1)];

const formatToFullDateAndTime = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');
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

const getTemplateFromItemsArray = (items = [], cb) => items.map((item) => cb(item)).join('');

const generateID = () => Math.random().toString(36).substr(2, 11);

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export {
  isEsc,
  capitalize,
  getRandomInteger,
  getRandomUniqueIntegerList,
  formatToFullDateAndTime,
  formatToFullDate,
  formatToMonthAndDay,
  formatToHoursAndMin,
  getDuration,
  getTemplateFromItemsArray,
  getRandomEventType,
  formatToEditEventFormDatetime,
  generateID,
  createElement,
  render,
  RenderPosition
};
