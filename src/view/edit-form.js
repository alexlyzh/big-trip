import {EVENT_TYPES, DESTINATIONS, OffersPriceList, LOREM_IPSUM} from '../constants.js';
import {getFullOffersPricelistByType} from '../mock/offer.js';
import Smart from './smart.js';
import {capitalize, formatToEditEventFormDatetime, formatToFullDateAndTime} from '../utils/point.js';
import {getRandomInteger, getTemplateFromItemsArray} from '../utils/common.js';
import {generatePictures, getRandomDescriptionValue, MAX_PICTURES_NUMBER, MIN_PICTURES_NUMBER} from '../mock/point';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const MIN_POINT_PRICE = 1;

const getCheckedOfferTitles = (offers) => offers.map((offer) => offer.title);

const createOfferSelectorTemplate = (offer, index, isChecked) => (
  `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-${index}" type="checkbox" name="event-offer-comfort" ${isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-comfort-${index}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
   </div>`);

const getOfferSelectorsTemplate = (availableOffers, checkedOffers = []) => {
  if (checkedOffers.length) {
    return availableOffers.map((offer, i) => createOfferSelectorTemplate(offer, i, checkedOffers.includes(offer.title))).join('');
  }
  return availableOffers.map((offer, i) => createOfferSelectorTemplate(offer, i, false)).join('');
};

const createPictureTemplate = ({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`;

const getPicturesTemplate = (destination) => {
  if (destination) {
    const {pictures} = destination;
    return getTemplateFromItemsArray(pictures, createPictureTemplate);
  }
};

const createEventTypeRadioTemplate = (type) => (
  `<div class="event__type-item">
     <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
     <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
   </div>`);

const createDestinationOptionTemplate = (destination) => `<option value="${destination}"></option>`;

const createEditEventFormTemplate = (data = {}) => {
  const { basePrice, dateFrom, dateTo, destination, offers, type, isOffersAvailable, isDescription, isPictures } = data;

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" ${type ? `src="img/icons/${type}.png"` : ''} alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${getTemplateFromItemsArray(EVENT_TYPES, createEventTypeRadioTemplate)}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1">
                  <datalist id="destination-list-1">
                    ${getTemplateFromItemsArray(DESTINATIONS, createDestinationOptionTemplate)}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatToEditEventFormDatetime(dateFrom)}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatToEditEventFormDatetime(dateTo)}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" autocomplete="off">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Cancel</button>
              </header>
              <section class="event__details ${isOffersAvailable || isDescription || isPictures ? '' : 'visually-hidden'}">
                <section class="event__section  event__section--offers ${isOffersAvailable ? '' : 'visually-hidden'}">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                  <div class="event__available-offers">
                    ${getOfferSelectorsTemplate(getFullOffersPricelistByType(type), getCheckedOfferTitles(offers))}
                  </div>
                </section>

                <section class="event__section  event__section--destination ${isPictures || isDescription ? '' : 'visually-hidden' }">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${isDescription ? destination.description : ''}</p>

                  <div class="event__photos-container ${isPictures ? '' : 'visually-hidden'}">
                    <div class="event__photos-tape">
                      ${getPicturesTemplate(destination)}
                    </div>
                  </div>
                </section>
              </section>
            </form>
          </li>`;
};

export default class EditFormView extends Smart {
  constructor(point) {
    super();
    this._data = EditFormView.parsePointToData(point);
    this._availableOffers = getFullOffersPricelistByType(this._data.type);
    this._startDatepicker = null;
    this._endDatepicker = null;

    this._onEventTypeChange = this._onEventTypeChange.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
    this._onOffersChange = this._onOffersChange.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onResetBtnClick = this._onResetBtnClick.bind(this);
    this._onStartDateChange = this._onStartDateChange.bind(this);
    this._onEndDateChange = this._onEndDateChange.bind(this);
    this._onPriceChange = this._onPriceChange.bind(this);

    this._setInnerHandlers();
    this._setDatepickers();
  }

  reset(point) {
    this.updateData(
      EditFormView.parsePointToData(point),
    );
  }

  getTemplate() {
    return createEditEventFormTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setOnFormSubmit(this._callback.onFormSubmit);
    this.setOnResetBtnClick(this._callback.onResetBtnClick);
    this._setDatepickers();
  }

  _setDatepickers() {
    this._destroyDatepickers();

    this._startDatepicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/Y H:i',
        defaultDate: new Date(this._data.dateFrom),
        enableTime: true,
        maxDate: new Date(this._data.dateTo),
        onChange: this._onStartDateChange,
      },
    );
    this._endDatepicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/Y H:i',
        defaultDate: new Date(this._data.dateTo),
        enableTime: true,
        minDate: new Date(this._data.dateFrom),
        onChange: this._onEndDateChange,
      },
    );
  }

  _destroyDatepickers() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._onEventTypeChange);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._onDestinationChange);
    this.getElement().querySelector('.event__available-offers').addEventListener('change', this._onOffersChange);
    this.getElement().querySelector('.event__field-group--price').addEventListener('input', this._onPriceChange);
  }

  _onPriceChange(evt) {
    this.updateData({
      basePrice: Math.max(parseInt(evt.target.value,10), MIN_POINT_PRICE),
    }, true);
  }

  _onStartDateChange([date]) {
    this.updateData({
      dateFrom: formatToFullDateAndTime(date),
    });
  }

  _onEndDateChange([date]) {
    this.updateData({
      dateTo: formatToFullDateAndTime(date),
    });
  }

  _onDestinationChange(evt) {
    const description = getRandomDescriptionValue(LOREM_IPSUM);
    const pictures = generatePictures(getRandomInteger(MIN_PICTURES_NUMBER, MAX_PICTURES_NUMBER));

    this.updateData({
      destination: {
        name: evt.target.value,
        description,
        pictures,
      },
      isDescription: Boolean(description),
      isPictures: Boolean(pictures.length),
    });
  }

  _onEventTypeChange(evt) {
    this._availableOffers = getFullOffersPricelistByType(evt.target.value);

    this.updateData({
      type: evt.target.value,
      offers: [],
      isOffersAvailable: evt.target.value in OffersPriceList,
    });
  }

  _onOffersChange() {
    const selectedOffersIndexList = Array.from(this.getElement().querySelectorAll('.event__offer-checkbox:checked')).map((offer) => Number(offer.id.slice(20)));
    this.updateData({
      offers: this._availableOffers.filter((offer, i) => selectedOffersIndexList.includes(i)),
    });
  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    this._callback.onFormSubmit(EditFormView.parseDataToPoint(this._data));
  }

  _onResetBtnClick() {
    this._callback.onResetBtnClick();
  }

  setOnFormSubmit(callback) {
    this._callback.onFormSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._onFormSubmit);
  }

  setOnResetBtnClick(callback) {
    this._callback.onResetBtnClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._onResetBtnClick);
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {
        isOffersAvailable: point.type in OffersPriceList,
        isDescription: Boolean(point.destination.description),
        isPictures: Boolean(point.destination.pictures.length),
      });
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    delete data.isOffersAvailable;
    delete data.isDescription;
    delete data.isPictures;

    return data;
  }
}
