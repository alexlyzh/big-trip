import {getTemplateFromItemsArray} from './utils.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersFormTemplate} from './view/filters-form.js';
import {createSortFormTemplate} from './view/sort-form.js';
import {createPointsListTemplate, getPointsList} from './view/points-list.js';
import {createPointTemplate} from './view/point.js';

const getAuthorizationID = () => `Basic ${Math.random().toString(36).substr(2, 11)}`;
getAuthorizationID();

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

render(tripMainElement, createTripInfoTemplate(), 'afterbegin');
render(tripNavigationElement, createMenuTemplate(), 'beforeend');
render(tripFiltersElement, createFiltersFormTemplate(), 'beforeend');
render(tripEventsElement, createSortFormTemplate(), 'beforeend');
render(tripEventsElement, createPointsListTemplate(), 'beforeend');

const eventsListElement = tripEventsElement.querySelector('.trip-events__list');

const points = getPointsList();

render(eventsListElement, getTemplateFromItemsArray(points, createPointTemplate), 'beforeend');
