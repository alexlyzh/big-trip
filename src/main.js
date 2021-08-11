import {render, RenderPosition} from './utils/render.js';
import PointsListView from './view/points-list.js';
import TripInfoView from './view/trip-info.js';
import Menu from './view/menu.js';
import FiltersForm from './view/filters-form.js';
import SortForm from './view/sort-form.js';
import {getPointsList} from './mock/point.js';
import NoPoints from './view/no-points.js';
import {generateID} from './utils/common.js';
import {renderPoint} from './utils/point.js';

const POINTS_COUNT = 20;

const getAuthorizationID = () => `Basic ${generateID()}`;
getAuthorizationID();

const points = getPointsList(POINTS_COUNT);
const pointsListComponent = new PointsListView();
const menuComponent = new Menu();
const tripInfoComponent = new TripInfoView(points);
const sortFormComponent = new SortForm(points);
const filterFormComponent = new FiltersForm();

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

if (!points.length) {
  const invite = new NoPoints();
  render(tripEventsElement, invite, RenderPosition.BEFOREEND);
}

render(tripFiltersElement, filterFormComponent, RenderPosition.BEFOREEND);
render(tripEventsElement, sortFormComponent, RenderPosition.BEFOREEND);
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripEventsElement, pointsListComponent, RenderPosition.BEFOREEND);
render(tripNavigationElement, menuComponent, RenderPosition.BEFOREEND);

const pointsListElement = tripEventsElement.querySelector('.trip-events__list');

points.forEach((point) => renderPoint(pointsListElement, point));
