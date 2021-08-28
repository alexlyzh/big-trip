const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DESTINATIONS = [
  'Den Haag',
  'Chamonix',
  'Helsinki',
  'Nagasaki',
  'Rome',
  'Rotterdam',
  'Valencia',
  'Kioto',
  'Den Haag',
  'Oslo',
  'Kioto',
  'Oslo',
  'Kioto',
  'Vien',
  'Den Haag',
  'Kioto',
  'Saint Petersburg',
  'Oslo',
  'Berlin',
  'Moscow'];

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
  .split('. ');

const OffersPriceList = {
  bus: {
    'Infotainment system': 160,
    'Order meal': 120,
    'Choose seats': 60,
  },
  drive: {
    'Choose comfort class': 150,
    'Choose business class': 130,
  },
  flight: {
    'Choose meal': 180,
    'Choose seats': 190,
    'Upgrade to comfort class': 100,
    'Upgrade to business class': 130,
    'Add luggage': 110,
    'Business lounge': 150,
  },
  ship: {
    'Choose meal': 160,
    'Choose seats': 100,
    'Upgrade to comfort class': 100,
    'Upgrade to business class': 100,
    'Add luggage': 120,
    'Business lounge': 90,
  },
  taxi: {
    'Upgrade to business class': 150,
    'Choose the radio station': 70,
    'Choose temperature': 110,
    'Drive quickly, I\'m in a hurry': 150,
    'Drive slowly': 190,
  },
  train: {
    'Book a taxi at the arrival point': 180,
    'Order a breakfast': 120,
    'Wake up at a certain time': 60,
  },
  'check-in': {
    'Choose the time of check-in': 80,
    'Choose the time of check-out': 100,
    'Add breakfast': 150,
    'Laundry': 60,
    'Order a meal from the restaurant': 180,
  },
  restaurant: {
    'Choose live music': 50,
    'Choose VIP area': 180,
  },
};

const FilterNames = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const SortParameters = {
  DAY: {
    value: 'day',
    isDisabled: false,
  },
  EVENT: {
    value: 'event',
    isDisabled: true,
  },
  TIME: {
    value: 'time',
    isDisabled: false,
  },
  PRICE: {
    value: 'price',
    isDisabled: false,
  },
  OFFERS: {
    value: 'offers',
    isDisabled: true,
  },
};

const MILLISECONDS_IN_DAY = 86400000;
const MILLISECONDS_IN_HOUR = 3600000;
const MILLISECONDS_IN_MINUTE = 60000;

const UNIX_START_DAY = 1;

const EditFormMode = {
  EDIT: 'EDIT',
  CREATE: 'CREATE',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {EVENT_TYPES, DESTINATIONS, LOREM_IPSUM, OffersPriceList, FilterNames, SortParameters, MILLISECONDS_IN_MINUTE, UNIX_START_DAY, MILLISECONDS_IN_DAY, MILLISECONDS_IN_HOUR, EditFormMode};
