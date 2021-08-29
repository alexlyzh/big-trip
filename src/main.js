import {render, RenderPosition} from './utils/render.js';
import MenuView from './view/menu.js';
import {getPointsList} from './mock/point.js';
import {generateID} from './utils/common.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';

const POINTS_COUNT = 3;

const getAuthorizationID = () => `Basic ${generateID()}`;
getAuthorizationID();

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const points = getPointsList(POINTS_COUNT);
const menuComponent = new MenuView();

const pointsModel = new PointsModel();
pointsModel.points = points;

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(tripEventsElement, tripMainElement, pointsModel, filterModel);
tripPresenter.init();

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
tripInfoPresenter.init();

tripMainElement.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint(evt.target);
});

render(tripNavigationElement, menuComponent, RenderPosition.BEFOREEND);
