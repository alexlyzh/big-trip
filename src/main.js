import PointsListView from './view/points-list.js';
import {render, renderElement, getTemplateFromItemsArray, generateID, RenderPosition} from './utils.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersFormTemplate} from './view/filters-form.js';
import {createSortFormTemplate} from './view/sort-form.js';
import {getPointsList} from './mock/point.js';
import {createPointTemplate} from './view/point.js';
import {createEditEventFormTemplate} from './view/edit-event-form.js';

const POINTS_COUNT = 20;

const getAuthorizationID = () => `Basic ${generateID()}`;
getAuthorizationID();

const pointsListComponent = new PointsListView();
const points = getPointsList(POINTS_COUNT);

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

tripEventsElement.classList.toggle('visually-hidden', !points.length);

render(tripMainElement, createTripInfoTemplate(points), RenderPosition.AFTERBEGIN);
render(tripNavigationElement, createMenuTemplate(), RenderPosition.BEFOREEND);
render(tripFiltersElement, createFiltersFormTemplate(), RenderPosition.BEFOREEND);
render(tripEventsElement, createSortFormTemplate(), RenderPosition.BEFOREEND);
renderElement(tripEventsElement, pointsListComponent.getElement(), RenderPosition.BEFOREEND);

const eventsListElement = tripEventsElement.querySelector('.trip-events__list');

const renderPoints = (first, ...rest) => {
  render(eventsListElement, createEditEventFormTemplate(first), 'beforeend');
  render(eventsListElement, getTemplateFromItemsArray(rest, createPointTemplate), 'beforeend');
};

renderPoints(...points);

const tripEventsLabelElements = tripEventsElement.querySelectorAll('.event__type-label');
tripEventsLabelElements.forEach((element) => element.style.textTransform = 'capitalize');
