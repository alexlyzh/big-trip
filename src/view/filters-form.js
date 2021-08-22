import {FilterNames} from '../constants.js';
import Abstract from './abstract.js';
import {getTemplateFromItemsArray} from '../utils/common.js';

const createFilterTemplate = (filterName) => {
  const {value, isChecked} = FilterNames[filterName];

  return `<div class="trip-filters__filter">
             <input
                id="filter-${value}"
                class="trip-filters__filter-input visually-hidden"
                type="radio"
                name="trip-filter"
                value="${value}"
                ${isChecked ? 'checked' : ''}
             >
             <label class="trip-filters__filter-label" for="filter-${value}">${value}</label>
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

export default class FiltersForm extends Abstract {
  getTemplate() {
    return createFiltersFormTemplate();
  }
}
