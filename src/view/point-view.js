import Abstract from './abstract.js';
import {formatToFullDate, formatToHoursAndMin, formatToMonthAndDay, getDuration} from '../utils/point.js';
import {getTemplateFromItemsArray} from '../utils/common.js';

const createOfferTemplate = (offer) => (
  `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`
);

const createPointTemplate = (point) => {
  const {
    isFavorite,
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type} = point;

  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${formatToFullDate(dateFrom)}">${formatToMonthAndDay(dateFrom)}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${type} ${destination.name}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${dateFrom}">${formatToHoursAndMin(dateFrom)}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${dateTo}">${formatToHoursAndMin(dateTo)}</time>
                </p>
                <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
              </p>
              <h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">
                ${getTemplateFromItemsArray(offers, createOfferTemplate)}
              </ul>
              <button class="${isFavorite ? 'event__favorite-btn event__favorite-btn--active' : 'event__favorite-btn'}" type="button">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
              </button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`;
};

export default class PointView extends Abstract {
  constructor(point) {
    super();
    this._point = point;

    this._onRollupBtnClick = this._onRollupBtnClick.bind(this);
    this._onFavoriteBtnClick = this._onFavoriteBtnClick.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  setOnFavoriteBtnClick(callback) {
    this._callback.onFavoriteBtnClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._onFavoriteBtnClick);
  }

  setOnRollupBtnClick(callback) {
    this._callback.onRollupButtonClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._onRollupBtnClick);
  }

  _onRollupBtnClick() {
    this._callback.onRollupButtonClick();
  }

  _onFavoriteBtnClick() {
    this._callback.onFavoriteBtnClick();
  }
}
