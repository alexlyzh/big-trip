import dayjs from 'dayjs';
import {getRandomInteger} from '../utils.js';
import {DESTINATIONS, LOREM_IPSUM} from '../constants.js';
import {getOffersForEventType} from './offer.js';

const MIN_BASE_PRICE = 300;
const MAX_BASE_PRICE = 1100;
const MIN_PICTURES_NUMBER = 1;
const MAX_PICTURES_NUMBER = 5;

const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day');
};

const generatePictures = (quantity) => new Array(quantity).fill(null).map(() => (
  {
    src: `http://picsum.photos/300/200?r=${Math.random()}`,
    description: 'Event photo',
  }
));

const generatePoint = (type, id) => {
  const dateFrom = generateDate();
  const dateTo = dateFrom.add(getRandomInteger(1,5),'day');

  return {
    basePrice: getRandomInteger(MIN_BASE_PRICE, MAX_BASE_PRICE),
    dateFrom: dateFrom.toString(),
    dateTo: dateTo.toString(),
    destination: {
      name: DESTINATIONS[getRandomInteger(0, DESTINATIONS.length - 1)],
      description: LOREM_IPSUM[getRandomInteger(0, LOREM_IPSUM.length - 1)],
      pictures: generatePictures(getRandomInteger(MIN_PICTURES_NUMBER, MAX_PICTURES_NUMBER)),
    },
    id,
    isFavorite: Boolean(getRandomInteger()),
    offers: getOffersForEventType(type),
    type,
  };
};

export {generatePoint};
