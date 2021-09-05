import AbstractObserver from '../utils/abstract-observer';

export default class PointsModel extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
  }

  getItems() {
    return this._points;
  }

  setItems(updateType, points) {
    this._points = [...points];
    this._notify(updateType);
  }

  update(updateType, update) {
    const index = this._points.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  add(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  delete(updateType, update) {
    const index = this._points.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adapted = Object.assign({}, point, {
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    });

    delete adapted['base_price'];
    delete adapted['date_from'];
    delete adapted['date_to'];
    delete adapted['is_favorite'];

    return adapted;
  }

  static adaptToServer(point) {
    const adapted = Object.assign({}, point, {
      ['base_price']: point.basePrice,
      ['date_from']: point.dateFrom,
      ['date_to']: point.dateTo,
      ['is_favorite']: point.isFavorite,
    });

    delete adapted.basePrice;
    delete adapted.dateFrom;
    delete adapted.dateTo;
    delete adapted.isFavorite;

    return adapted;
  }
}
