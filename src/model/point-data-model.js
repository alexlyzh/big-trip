import AbstractObserver from '../utils/abstract-observer';

export default class PointDataModel extends AbstractObserver {
  constructor() {
    super();
    this._offers = new Map();
    this._destinations = new Map();
  }

  getOffers() {
    return this._offers;
  }

  setOffers(updateType, offers) {
    offers.forEach((offer) => this._offers.set(offer.type, offer.offers));
    this._notify(updateType);
  }

  getDestinations() {
    return this._destinations;
  }

  setDestinations(updateType, destinations) {
    destinations.forEach((destination) => this._destinations.set(destination.name, {
      description: destination.description,
      pictures: destination.pictures,
    }));
    this._notify(updateType);
  }
}
