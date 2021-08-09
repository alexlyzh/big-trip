import {createElement, getTemplateFromItemsArray} from '../utils.js';
import {FilterNames} from '../constants.js';

const createFilterTemplate = (filterName) => {
  const {value, isChecked} = FilterNames[filterName];

  return `<div class="trip-filters__filter">
             <input
                id="filter-everything"
                class="trip-filters__filter-input visually-hidden"
                type="radio"
                name="trip-filter"
                value="${value}"
                ${isChecked ? 'checked' : ''}
             >
             <label class="trip-filters__filter-label" for="filter-everything">${value}</label>
          </div>`;
};

const getFiltersTemplate = (filtersObject) => {
  const filterNames = Object.keys(filtersObject);
  return getTemplateFromItemsArray(filterNames, createFilterTemplate);
};

const createFiltersFormTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
      ${getFiltersTemplate(FilterNames)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
);

export default class FiltersForm {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFiltersFormTemplate();
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
