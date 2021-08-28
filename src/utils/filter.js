import {FilterNames} from '../constants';
import {isExpired, isHappeningNow} from './point';

const filter = {
  [FilterNames.EVERYTHING]: (points) => points.slice(),
  [FilterNames.FUTURE]: (points) => points.filter((point) => isHappeningNow(point) || !isExpired(point)),
  [FilterNames.PAST]: (points) => points.filter((point) => isHappeningNow(point) || isExpired(point)),
};

export {filter};
