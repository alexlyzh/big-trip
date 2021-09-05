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
const MILLISECONDS_IN_SECOND = 1000;

const UNIX_START_DAY = 1;

const EditFormMode = {
  EDIT: 'EDIT',
  CREATE: 'CREATE',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const NoPointsTexts = {
  [FilterNames.EVERYTHING]: 'Click New Event to create your first point',
  [FilterNames.FUTURE]: 'There are no future events now',
  [FilterNames.PAST]: 'There are no past events now',
};

const MenuItem = {
  ADD_POINT: 'add',
  TABLE: 'table',
  STATS: 'stats',
};

const ChartNames = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME: 'TIME-SPENT',
};

export {
  FilterNames,
  SortParameters,
  MILLISECONDS_IN_SECOND,
  MILLISECONDS_IN_MINUTE,
  UNIX_START_DAY,
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_HOUR,
  EditFormMode,
  NoPointsTexts,
  UserAction,
  UpdateType,
  MenuItem,
  ChartNames
};
