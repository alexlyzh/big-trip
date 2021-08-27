import {render, RenderPosition} from './utils/render.js';
import TripInfoView from './view/trip-info.js';
import Menu from './view/menu.js';
import FiltersForm from './view/filters-form.js';
import {getPointsList} from './mock/point.js';
import {generateID} from './utils/common.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points';

const POINTS_COUNT = 20;

const getAuthorizationID = () => `Basic ${generateID()}`;
getAuthorizationID();

const points = getPointsList(POINTS_COUNT);
const menuComponent = new Menu();
const tripInfoComponent = new TripInfoView(points);
const filterFormComponent = new FiltersForm();

const pointsModel = new PointsModel();
pointsModel.points = points;

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const trip = new TripPresenter(tripEventsElement, pointsModel);
trip.init();

render(tripFiltersElement, filterFormComponent, RenderPosition.BEFOREEND);
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripNavigationElement, menuComponent, RenderPosition.BEFOREEND);
