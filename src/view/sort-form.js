import {createElement, getTemplateFromItemsArray} from '../utils.js';
import {SortParameters} from '../constants.js';

const createSortItemTemplate = (parameter) => {
  const {value, isChecked, isDisabled} = SortParameters[parameter];

  return`<div class="trip-sort__item trip-sort__item--${value}">
            <input
              id="sort-${value}"
              class="trip-sort__input visually-hidden"
              type="radio"
              name="trip-sort"
              value="sort-${value}"
              ${isChecked ? 'checked' : ''}
              ${isDisabled ? 'disabled' : ''}
            >
            <label class="trip-sort__btn" for="sort-${value}">${value}</label>
         </div>`;
};

const getSortParametersTemplate = (parametersObject) => {
  const parameters = Object.keys(parametersObject);
  return getTemplateFromItemsArray(parameters, createSortItemTemplate);
};

const createSortFormTemplate = (points) => (
  !points.length ?
    `<form class="trip-events__trip-sort trip-sort visually-hidden" action="#" method="get">
     </form>` :
    `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
        ${getSortParametersTemplate(SortParameters)}
     </form>`
);

export default class SortForm {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createSortFormTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
