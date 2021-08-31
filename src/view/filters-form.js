import Abstract from './abstract.js';

const createFilterTemplate = (filter, currentFilter, isDisabled) => {
  const {value, count} = filter;
  return `<div class="trip-filters__filter">
             <input
                id="filter-${value}"
                class="trip-filters__filter-input visually-hidden"
                type="radio"
                name="trip-filter"
                value="${value}"
                ${value === currentFilter ? 'checked' : ''}
                ${isDisabled || !count ? 'disabled' : ''}
             >
             <label class="trip-filters__filter-label" for="filter-${value}">${value}</label>
         </div>`;
};

const createFiltersFormTemplate = (filters, currentFilter, isDisabled) => (
  `<form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => createFilterTemplate(filter, currentFilter, isDisabled)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
);

export default class FilterView extends Abstract {
  constructor(filters, currentFilter, isDisabled) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;
    this._isDisabled = isDisabled;

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
    return createFiltersFormTemplate(this._filters, this._currentFilter, this._isDisabled);
  }
}
