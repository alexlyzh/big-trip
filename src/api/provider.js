import PointsModel from '../model/points';
import {isOnline} from '../utils/common.js';

const StorageKeys = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
};

const getSyncedPoints = (items) => items.filter(({success}) => success).map(({payload}) => payload.point);

const createStoreStructure = (items) =>
  items.reduce((acc, current) => Object.assign({}, acc, {
    [current.id]: current,
  }), {});

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  updatePoint(point) {
    const points = this._store.getItems().points;

    if (isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(StorageKeys.POINTS, Object.assign({}, points, {
            [updatedPoint.id]: PointsModel.adaptToServer(updatedPoint),
          }));
          return updatedPoint;
        });
    }

    this._store.setItem(StorageKeys.POINTS, Object.assign({}, points, {
      [point.id]: PointsModel.adaptToServer(Object.assign({}, point)),
    }));

    return Promise.resolve(point);
  }

  addPoint(point) {
    const points = this._store.getItems().points;

    if (isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(StorageKeys.POINTS, Object.assign({}, points, {
            [newPoint.id]: PointsModel.adaptToServer(newPoint),
          }));
          return newPoint;
        });
    }

    return Promise.reject(new Error('Add point failed'));
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(PointsModel.adaptToServer));
          this._store.setItem(StorageKeys.POINTS, items);
          return points;
        });
    }

    const storedPoints = Object.values(this._store.getItems().points);
    return Promise.resolve(storedPoints.map(PointsModel.adaptToClient));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setItem(StorageKeys.OFFERS, offers);
          return offers;
        });
    }

    return Promise.resolve(this._store.getItems().offers);
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setItem(StorageKeys.DESTINATIONS, destinations);
          return destinations;
        });
    }

    return Promise.resolve(this._store.getItems().destinations);
  }

  sync() {
    if (isOnline()) {
      const storedPoints = Object.values(this._store.getItems().points);

      return this._api.sync(storedPoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);
          const items = createStoreStructure([...createdPoints, ...updatedPoints]);
          this._store.setItem(StorageKeys.POINTS, items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
