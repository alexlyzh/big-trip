import {getTemplateFromItemsArray} from '../utils.js';

const SortParameters = {
  day: {
    value: 'day',
    isChecked: true,
    isDisabled: false,
  },
  event: {
    value: 'event',
    isChecked: false,
    isDisabled: true,
  },
  time: {
    value: 'time',
    isChecked: false,
    isDisabled: false,
  },
  price: {
    value: 'price',
    isChecked: false,
    isDisabled: false,
  },
  offers: {
    value: 'offers',
    isChecked: false,
    isDisabled: true,
  },
};

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

const createSortFormTemplate = () => (
  `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${getSortParametersTemplate(SortParameters)}
   </form>`
);

export {createSortFormTemplate};
