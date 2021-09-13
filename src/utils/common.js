import {MILLISECONDS_IN_DAY, MILLISECONDS_IN_HOUR, MILLISECONDS_IN_MINUTE, UNIX_START_DAY} from '../constants';
import dayjs from 'dayjs';

const getTemplateFromItemsArray = (items = [], cb) => items.map((item) => cb(item)).join('');
const isEsc = (evt) => evt.keyCode === 27;

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const getDurationFormat = (milliseconds) => {
  let format;

  switch (true) {
    case milliseconds >= MILLISECONDS_IN_DAY:
      format = 'DD[D] HH[H] mm[M]';
      break;
    case milliseconds >= MILLISECONDS_IN_HOUR:
      format = 'HH[H] mm[M]';
      break;
    default:
      format = 'mm[M]';
  }

  return format;
};

const formatDuration = (duration) => {
  duration = duration + new Date(duration).getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
  return dayjs(duration).subtract(UNIX_START_DAY, 'day').format(getDurationFormat(duration));
};

const isOnline = () => window.navigator.onLine;

export {isEsc, getTemplateFromItemsArray, capitalize, getDurationFormat, formatDuration, isOnline};
