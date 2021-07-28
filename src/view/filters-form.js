const FilterNames = {
  EVERYTHING: {
    value: 'everything',
    isChecked: true,
  },
  FUTURE: {
    value: 'future',
    isChecked: false,
  },
  PAST: {
    value: 'past',
    isChecked: false,
  },
};

const createFilterTemplate = ({value, isChecked}) => (
  `<div class="trip-filters__filter">
     <input
        id="filter-everything"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${value}"
        ${isChecked ? 'checked' : ''}
     >
     <label class="trip-filters__filter-label" for="filter-everything">${value}</label>
   </div>`
);

const getFiltersTemplate = (filters) => {
  let template = '';
  for (const filter in filters) {
    template += createFilterTemplate(filters[filter]);
  }
  return template;
};

const createFiltersFormTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
      ${getFiltersTemplate(FilterNames)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
);

export {createFiltersFormTemplate};
