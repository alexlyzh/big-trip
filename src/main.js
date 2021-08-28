import {render, RenderPosition} from './utils/render.js';
import TripInfoView from './view/trip-info.js';
import MenuView from './view/menu.js';
import {getPointsList} from './mock/point.js';
import {generateID} from './utils/common.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';

const POINTS_COUNT = 20;

const getAuthorizationID = () => `Basic ${generateID()}`;
getAuthorizationID();

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const points = getPointsList(POINTS_COUNT);
const menuComponent = new MenuView();
const tripInfoComponent = new TripInfoView(points);

const pointsModel = new PointsModel();
pointsModel.points = points;

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);
filterPresenter.init();

const trip = new TripPresenter(tripEventsElement, pointsModel);
trip.init();

render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripNavigationElement, menuComponent, RenderPosition.BEFOREEND);
