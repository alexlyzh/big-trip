import dayjs from 'dayjs';
import {DESTINATIONS, LOREM_IPSUM} from '../constants.js';
import {getRandomOffersPricelistByType} from './offer.js';
import {generateID, getRandomInteger} from '../utils/common.js';
import {formatToFullDateAndTime, getRandomEventType} from '../utils/point.js';

const MIN_BASE_PRICE = 300;
const MAX_BASE_PRICE = 1100;
const MIN_PICTURES_NUMBER = 0;
const MAX_PICTURES_NUMBER = 10;
const MIN_MINUTES_INCREMENT = 30;
const MAX_MINUTES_INCREMENT = 2880;

const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  return dayjs().add(daysGap, 'day');
};

const generatePictures = (quantity) => new Array(quantity).fill(null).map(() => (
  {
    src: `http://picsum.photos/248/152?r=${Math.random()}`,
    description: 'Event photo',
  }
));

const getRandomDestinationValue = (constants) => constants[getRandomInteger(0, constants.length - 1)];
const getRandomDescriptionValue = (constants) => !getRandomInteger() ? '' : getRandomDestinationValue(constants);

const generatePoint = (type) => {
  const dateFrom = generateDate();
  const dateTo = dateFrom.add(getRandomInteger(MIN_MINUTES_INCREMENT, MAX_MINUTES_INCREMENT),'minute');

  return {
    basePrice: getRandomInteger(MIN_BASE_PRICE, MAX_BASE_PRICE),
    dateFrom: formatToFullDateAndTime(dateFrom),
    dateTo: formatToFullDateAndTime(dateTo),
    destination: {
      name: getRandomDestinationValue(DESTINATIONS),
      description: getRandomDescriptionValue(LOREM_IPSUM),
      pictures: generatePictures(getRandomInteger(MIN_PICTURES_NUMBER, MAX_PICTURES_NUMBER)),
    },
    id: generateID(),
    isFavorite: Boolean(getRandomInteger()),
    offers: getRandomOffersPricelistByType(type) || [],
    type,
  };
};

const getPointsList = (pointsCount) => {
  const points = new Array(pointsCount).fill(null).map(() => generatePoint(getRandomEventType()));
  return points.sort((a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom));
};

export {generatePoint, getPointsList, getRandomDescriptionValue, generatePictures, MIN_PICTURES_NUMBER, MAX_PICTURES_NUMBER};
