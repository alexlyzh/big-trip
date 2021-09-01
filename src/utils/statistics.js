import dayjs from 'dayjs';
import {ChartNames} from '../constants';
import {formatDuration} from './common';

const filterPointsByType = (points, type) => points.filter((point) => point.type === type.toLowerCase());
const countPrice = (points) => points.reduce((price, point) => price + point.basePrice, 0);
const countQuantity = (points) => points.length;
const countDuration = (points) => points.reduce((duration, point) => duration + dayjs(point.dateTo).diff(dayjs(point.dateFrom), 'millisecond'), 0);
const getUniquePointTypes = (points) => [...new Set(points.map((point) => point.type.toUpperCase()))];

const getTotalsByType = (points, callback) => {
  const types = getUniquePointTypes(points);
  const totals = new Map();

  types.forEach((type) => {
    const filteredPoints = filterPointsByType(points, type);
    totals.set(type, callback(filteredPoints));
  });

  return totals;
};

const getFormatter = (val, type) => {
  switch (type) {
    case ChartNames.MONEY:
      return `€ ${val}`;
    case ChartNames.TYPE:
      return `${val}x`;
    case ChartNames.TIME:
      return `${formatDuration(val)}`;
  }
};

export {getUniquePointTypes, filterPointsByType, getTotalsByType, countPrice, countDuration, countQuantity, getFormatter};
