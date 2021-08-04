import {getRandomEventType} from '../utils.js';
import {generatePoint} from '../mock/point';
import dayjs from 'dayjs';

const createPointsListTemplate = () => (
  `<ul class="trip-events__list">
   </ul>`
);

const getPointsList = (pointsCount) => {
  const points = new Array(pointsCount).fill(null).map((event, i) => generatePoint(getRandomEventType(), i));
  return points.sort((a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom));
};

export {createPointsListTemplate, getPointsList};
