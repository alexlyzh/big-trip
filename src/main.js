import {createTripInfoTemplate} from './view/trip-info.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersFormTemplate} from './view/filters-form.js';
import {createSortFormTemplate} from './view/sort-form.js';
import {createEventsListTemplate} from './view/trip-events-list.js';

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMainElement, createTripInfoTemplate(), 'afterbegin');
render(tripNavigationElement, createMenuTemplate(), 'beforeend');
render(tripFiltersElement, createFiltersFormTemplate(), 'beforeend');
render(tripEventsElement, createSortFormTemplate(), 'beforeend');
render(tripEventsElement, createEventsListTemplate(), 'beforeend');
