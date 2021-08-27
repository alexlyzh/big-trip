import {SortParameters} from '../constants.js';
import Abstract from './abstract.js';

const createSortItemTemplate = (parameter, currentSortType) => {
  const {value, isDisabled} = SortParameters[parameter];

  return`<div class="trip-sort__item trip-sort__item--${value}">
            <input
              id="sort-${value}"
              class="trip-sort__input visually-hidden"
              type="radio"
              name="trip-sort"
              value="sort-${value}"
              ${parameter.toLowerCase() === currentSortType ? 'checked' : ''}
              ${isDisabled ? 'disabled' : ''}
            >
            <label class="trip-sort__btn" for="sort-${value}">${value}</label>
         </div>`;
};

const getSortParametersTemplate = (parametersObject, currentSortType) => {
  const parameters = Object.keys(parametersObject);
  return parameters.map((parameter) => createSortItemTemplate(parameter, currentSortType)).join('');
};

const createSortFormTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${getSortParametersTemplate(SortParameters, currentSortType)}
   </form>`
);

export default class SortFormView extends Abstract {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  getTemplate() {
    return createSortFormTemplate(this._currentSortType);
  }

  _onSortTypeChange(evt) {
    this._callback.onSortTypeChange(evt.target.value.slice(5));
  }

  setOnSortTypeChange(callback) {
    this._callback.onSortTypeChange = callback;
    this.getElement().addEventListener('change', this._onSortTypeChange);
  }
}
