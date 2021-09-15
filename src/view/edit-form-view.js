import Smart from './smart.js';
import {EditFormMode} from '../constants.js';
import {formatToEditEventFormDatetime, formatToFullDateAndTime} from '../utils/point.js';
import {capitalize, getTemplateFromItemsArray} from '../utils/common.js';
import flatpickr from 'flatpickr';
import he from 'he';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const MIN_POINT_PRICE = 1;

const BLANK_POINT = {
  basePrice: 500,
  dateFrom: formatToFullDateAndTime(new Date()),
  dateTo: formatToFullDateAndTime(new Date()),
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  isFavorite: false,
  offers: [],
  type: 'sightseeing',
};

const getCheckedOfferTitles = (offers) => offers.map((offer) => offer.title);

const createOfferSelectorTemplate = (offer, index, isChecked, isDisabled) => (
  `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-comfort-${index}"
        type="checkbox"
        name="event-offer-comfort" ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="event__offer-label" for="event-offer-comfort-${index}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
   </div>`);

const getOfferSelectorsTemplate = (availableOffers, isDisabled, checkedOffers = []) => {
  if (checkedOffers.length) {
    return availableOffers.map((offer, i) => createOfferSelectorTemplate(offer, i, checkedOffers.includes(offer.title), isDisabled)).join('');
  }
  return availableOffers.map((offer, i) => createOfferSelectorTemplate(offer, i, false, isDisabled)).join('');
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

const createRollupBtnTemplate = (isDisabled) => (`
  <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
    <span class="visually-hidden">Open event</span>
  </button>
`);

const createEditEventFormTemplate = (data, mode, offers, destinations) => {
  const { basePrice, dateFrom, dateTo, destination, offers: checkedOffers, type, isOffersAvailable, isDescription, isPictures, isSaving, isDeleting, isDisabled } = data;
  const eventTypes = Array.from(offers.keys());
  const destinationNames = Array.from(destinations.keys());
  const deleteLabel = (isDeleting ? 'Deleting...' : 'Delete');
  const saveLabel = (isSaving ? 'Saving...' : 'Save');

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" ${type ? `src="img/icons/${type}.png"` : ''} alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${getTemplateFromItemsArray(eventTypes, createEventTypeRadioTemplate)}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                  </label>
                  <input
                    class="event__input  event__input--destination"
                    id="event-destination-1"
                    type="text"
                    name="event-destination"
                    value="${he.encode(destination ? destination.name : '')}"
                    list="destination-list-1"
                    ${isDisabled ? 'disabled' : ''}
                  >
                  <datalist id="destination-list-1">
                    ${getTemplateFromItemsArray(destinationNames, createDestinationOptionTemplate)}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input
                    class="event__input  event__input--time"
                    id="event-start-time-1"
                    type="text"
                    name="event-start-time"
                    value="${formatToEditEventFormDatetime(dateFrom)}"
                    ${isDisabled ? 'disabled' : ''}
                  >
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input
                    class="event__input  event__input--time"
                    id="event-end-time-1"
                    type="text"
                    name="event-end-time"
                    value="${formatToEditEventFormDatetime(dateTo)}"
                    ${isDisabled ? 'disabled' : ''}
                  >
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input
                    class="event__input  event__input--price"
                    id="event-price-1"
                    type="number"
                    min="1"
                    name="event-price"
                    value="${he.encode(basePrice.toString())}"
                    autocomplete="off"
                    ${isDisabled ? 'disabled' : ''}
                  >
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${saveLabel}</button>
                <button
                  class="event__reset-btn"
                  type="reset" ${isDisabled ? 'disabled' : ''}
                  ${isDisabled ? 'disabled' : ''}
                >${mode === EditFormMode.EDIT ? deleteLabel : 'Cancel'}</button>
                ${mode === EditFormMode.EDIT ? createRollupBtnTemplate(isDisabled) : ''}
              </header>
              <section class="event__details ${isOffersAvailable || isDescription || isPictures ? '' : 'visually-hidden'}">
                <section class="event__section  event__section--offers ${isOffersAvailable ? '' : 'visually-hidden'}">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                  <div class="event__available-offers">
                    ${getOfferSelectorsTemplate(offers.get(type), isDisabled, getCheckedOfferTitles(checkedOffers))}
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
  constructor(point, offers, destinations, mode = EditFormMode.EDIT) {
    super();
    this._offers = offers;
    this._destinations = destinations;
    this._data = this.parsePointToData(point);
    this._availableOffers = this._offers.get(this._data.type);
    this._datepicker = null;
    this._mode = mode;
    this._isCreateMode = this._mode === EditFormMode.CREATE;

    this._onEventTypeChange = this._onEventTypeChange.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
    this._onOffersChange = this._onOffersChange.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onResetBtnClick = this._onResetBtnClick.bind(this);
    this._onRollupBtnClick = this._onRollupBtnClick.bind(this);
    this._onStartDateChange = this._onStartDateChange.bind(this);
    this._onEndDateChange = this._onEndDateChange.bind(this);
    this._onPriceChange = this._onPriceChange.bind(this);
    this._setDatepicker = this._setDatepicker.bind(this);

    this._setInnerHandlers();
  }

  get disabled() {
    return this._data.isDisabled;
  }

  reset(point) {
    this.updateData(
      this.parsePointToData(point),
    );
  }

  getTemplate() {
    return createEditEventFormTemplate(this._data, this._mode, this._offers, this._destinations);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setOnFormSubmit(this._callback.onFormSubmit);
    this.setOnResetBtnClick(this._callback.onResetBtnClick);
    !this._isCreateMode && this.setOnRollupBtnClick(this._callback.onRollupBtnClick);
  }

  removeElement() {
    super.removeElement();
    this._destroyDatepicker();
  }

  parsePointToData(point) {
    if (!point) {
      point = BLANK_POINT;
    }

    return Object.assign(
      {},
      point,
      {
        isOffersAvailable: Boolean(this._offers.get(point.type).length),
        isDescription: Boolean(point.destination.description),
        isPictures: Boolean(point.destination.pictures.length),
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
  }

  parseDataToPoint(data) {
    data = Object.assign({}, data);
    delete data.isOffersAvailable;
    delete data.isDescription;
    delete data.isPictures;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

  setOnFormSubmit(callback) {
    this._callback.onFormSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._onFormSubmit);
  }

  setOnResetBtnClick(callback) {
    this._callback.onResetBtnClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._onResetBtnClick);
  }

  setOnRollupBtnClick(callback) {
    this._callback.onRollupBtnClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._onRollupBtnClick);
  }

  _setDatepicker(element) {
    this._destroyDatepicker();
    const isStart = element.id.includes('start');

    this._datepicker = flatpickr(
      element, {
        dateFormat: 'd/m/Y H:i',
        defaultDate: isStart ? new Date(this._data.dateFrom) : new Date(this._data.dateTo),
        enableTime: true,
        onChange: isStart ? this._onStartDateChange : this._onEndDateChange,
      },
    );

    this._datepicker.open();
  }

  _onStartDateChange([start]) {
    let end = new Date(this._data.dateTo);
    end = start > end ? start : end;
    this._updateDates(start, end);
  }

  _onEndDateChange([end]) {
    let start = new Date(this._data.dateFrom);
    start = end < start ? end : start;
    this._updateDates(start, end);
  }

  _updateDates(start, end) {
    this.updateData({
      dateFrom: formatToFullDateAndTime(start),
      dateTo: formatToFullDateAndTime(end),
    });
  }

  _destroyDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', (evt) => this._onEventTypeChange(evt.target.value));
    this.getElement().querySelector('.event__input--destination').addEventListener('change', (evt) => this._onDestinationChange(evt.target));
    this.getElement().querySelector('.event__available-offers').addEventListener('change', () => this._onOffersChange());
    this.getElement().querySelector('.event__field-group--price').addEventListener('input', (evt) => this._onPriceChange(evt.target.value));
    this.getElement().querySelector('#event-start-time-1').addEventListener('click', (evt) => this._setDatepicker(evt.target));
    this.getElement().querySelector('#event-end-time-1').addEventListener('click', (evt) => this._setDatepicker(evt.target));
  }

  _onFormSubmit(evt) {
    evt.preventDefault();

    if (!this._destinations.has(this._data.destination.name)) {
      const inputElement = this.getElement().querySelector('.event__input--destination');
      inputElement.setCustomValidity('Please enter a valid destination. \nYou can choose from the drop-down list.');
      inputElement.reportValidity();
      return;
    }

    this._callback.onFormSubmit(this.parseDataToPoint(this._data));
  }

  _onResetBtnClick(evt) {
    evt.preventDefault();
    this._callback.onResetBtnClick(this.parseDataToPoint(this._data));
  }

  _onRollupBtnClick() {
    this._callback.onRollupBtnClick();
  }

  _onPriceChange(price) {
    this.updateData({
      basePrice: Math.max(parseInt(price,10), MIN_POINT_PRICE),
    }, true);
  }

  _onDestinationChange(inputElement) {
    let name = inputElement.value;
    const words = name.split(' ');
    name = words.reduce((string, word) => `${string} ${capitalize(word)}`, '').slice(1);

    let validity = '';
    if (!this._destinations.has(name)) {
      validity = 'Please enter a valid destination. \nYou can choose from the drop-down list.';
    }
    inputElement.setCustomValidity(validity);
    inputElement.reportValidity();

    if (!inputElement.validity.valid) {
      return;
    }

    const description = this._destinations.get(name).description;
    const pictures = this._destinations.get(name).pictures;

    this.updateData({
      destination: {
        name,
        description,
        pictures,
      },
      isDescription: Boolean(description),
      isPictures: Boolean(pictures.length),
    });
  }

  _onEventTypeChange(type) {
    this._availableOffers = this._offers.get(type);

    this.updateData({
      type,
      offers: [],
      isOffersAvailable: Boolean(this._availableOffers.length),
    });
  }

  _onOffersChange() {
    const selectedOffersIndexList = Array.from(this.getElement().querySelectorAll('.event__offer-checkbox:checked')).map((offer) => Number(offer.id.slice(20)));
    this.updateData({
      offers: this._availableOffers.filter((offer, i) => selectedOffersIndexList.includes(i)),
    });
  }
}
