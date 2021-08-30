import dayjs from 'dayjs';

const getUniquePointTypes = (points) => [...new Set(points.map((point) => point.type.toUpperCase()))];
const filterPointsByType = (points, type) => points.filter((point) => point.type === type.toLowerCase());
const countPrice = (points) => points.reduce((price, point) => price + point.basePrice, 0);
const countQuantity = (points) => points.length;
const countDuration = (points) => points.reduce((duration, point) => duration + dayjs(point.dateTo).diff(dayjs(point.dateFrom), 'millisecond'), 0);

const getTotalsByType = (points, callback) => {
  const types = getUniquePointTypes(points);
  const totals = new Map();

  types.forEach((type) => {
    const filteredPoints = filterPointsByType(points, type);
    totals.set(type, callback(filteredPoints));
  });

  return types.map((type) => totals.get(type));
};

export {getUniquePointTypes, filterPointsByType, getTotalsByType, countPrice, countDuration, countQuantity};
