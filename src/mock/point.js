import {DESTINATIONS, LOREM_IPSUM} from '../constants.js';
import {getRandomInteger} from '../utils/common.js';
import {formatToFullDateAndTime} from '../utils/point.js';

const MIN_PICTURES_NUMBER = 0;
const MAX_PICTURES_NUMBER = 10;

const generatePictures = (quantity) => new Array(quantity).fill(null).map(() => (
  {
    src: `http://picsum.photos/248/152?r=${Math.random()}`,
    description: 'Event photo',
  }
));

const getRandomDestinationValue = (constants) => constants[getRandomInteger(0, constants.length - 1)];
const getRandomDescriptionValue = (constants) => !getRandomInteger() ? '' : getRandomDestinationValue(constants);

const BLANK_POINT = {
  basePrice: 500,
  dateFrom: formatToFullDateAndTime(new Date()),
  dateTo: formatToFullDateAndTime(new Date()),
  destination: {
    name: getRandomDestinationValue(DESTINATIONS),
    description: getRandomDescriptionValue(LOREM_IPSUM),
    pictures: generatePictures(getRandomInteger(MIN_PICTURES_NUMBER, MAX_PICTURES_NUMBER)),
  },
  isFavorite: false,
  offers: [],
  type: 'sightseeing',
};

export {getRandomDescriptionValue, generatePictures, MIN_PICTURES_NUMBER, MAX_PICTURES_NUMBER, BLANK_POINT};
