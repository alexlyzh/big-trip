import {isEsc, render, generateID, RenderPosition} from './utils.js';
import PointsListView from './view/points-list.js';
import TripInfoView from './view/trip-info.js';
import Menu from './view/menu.js';
import FiltersForm from './view/filters-form.js';
import SortForm from './view/sort-form.js';
import {getPointsList} from './mock/point.js';
import PointView from './view/point.js';
import EditFormView from './view/edit-event-form.js';
import Invite from './view/invite.js';

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
  const invite = new Invite();
  render(tripEventsElement, invite.getElement(), RenderPosition.BEFOREEND);
}

render(tripFiltersElement, filterFormComponent.getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, sortFormComponent.getElement(), RenderPosition.BEFOREEND);
render(tripMainElement, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
render(tripEventsElement, pointsListComponent.getElement(), RenderPosition.BEFOREEND);
render(tripNavigationElement, menuComponent.getElement(), RenderPosition.BEFOREEND);

const pointsListElement = tripEventsElement.querySelector('.trip-events__list');

const renderPoint = (container, point) => {
  const pointComponent = new PointView(point);
  const editFormComponent = new EditFormView(point);

  const replacePointToForm = () => {
    pointsListElement.replaceChild(editFormComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    pointsListElement.replaceChild(pointComponent.getElement(), editFormComponent.getElement());
  };

  const onDocumentEscKeydown = (evt) => {
    if (isEsc(evt)) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onDocumentEscKeydown);
    }
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onDocumentEscKeydown);
  });

  editFormComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener('keydown', onDocumentEscKeydown);
  });

  editFormComponent.getElement().querySelector('.event__reset-btn').addEventListener('click', () => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onDocumentEscKeydown);
  });

  render(container, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

points.forEach((point) => renderPoint(pointsListElement, point));
