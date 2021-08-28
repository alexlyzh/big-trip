import Abstract from './abstract.js';

const createFilterTemplate = (filterName, currentFilter) => (
  `<div class="trip-filters__filter">
     <input
        id="filter-${filterName}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filterName}"
        ${filterName === currentFilter ? 'checked' : ''}
     >
     <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName}</label>
   </div>`);

const createFiltersFormTemplate = (filters, currentFilter) => (
  `<form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => createFilterTemplate(filter, currentFilter)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
);

export default class FilterView extends Abstract {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  _onFilterChange(newFilter) {
    this._callback.onFilterChange(newFilter);
  }

  setOnFilterChange(callback) {
    this._callback.onFilterChange = callback;
    this.getElement().addEventListener('change', (evt) => this._onFilterChange(evt.target.value));
  }

  getTemplate() {
    return createFiltersFormTemplate(this._filters, this._currentFilter);
  }
}
