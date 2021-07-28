const SortParameters = {
  DAY: {
    value: 'day',
    isChecked: true,
    isDisabled: false,
  },
  EVENT: {
    value: 'event',
    isChecked: false,
    isDisabled: true,
  },
  TIME: {
    value: 'time',
    isChecked: false,
    isDisabled: false,
  },
  PRICE: {
    value: 'price',
    isChecked: false,
    isDisabled: false,
  },
  OFFERS: {
    value: 'offers',
    isChecked: false,
    isDisabled: true,
  },
};

const createSortItemTemplate = ({value, isChecked, isDisabled}) => (
  `<div class="trip-sort__item trip-sort__item--${value}">
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
   </div>`
);

const getSortParametersTemplate = (parameters) => {
  let template = '';
  for (const parameter in parameters) {
    template += createSortItemTemplate(parameters[parameter]);
  }
  return template;
};

const createSortFormTemplate = () => (
  `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${getSortParametersTemplate(SortParameters)}
   </form>`
);

export {createSortFormTemplate};
