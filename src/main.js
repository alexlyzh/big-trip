import {render, RenderPosition, replace} from './utils/render.js';
import PointsListView from './view/points-list.js';
import TripInfoView from './view/trip-info.js';
import Menu from './view/menu.js';
import FiltersForm from './view/filters-form.js';
import SortForm from './view/sort-form.js';
import {getPointsList} from './mock/point.js';
import PointView from './view/point.js';
import EditFormView from './view/edit-event-form.js';
import NoPoints from './view/no-points.js';
import {generateID, isEsc} from './utils/common';

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

const renderPoint = (container, point) => {
  const pointComponent = new PointView(point);
  const editFormComponent = new EditFormView(point);

  const replacePointToForm = () => replace(editFormComponent, pointComponent);
  const replaceFormToPoint = () => replace(pointComponent, editFormComponent);

  const onDocumentEscKeydown = (evt) => {
    if (isEsc(evt)) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onDocumentEscKeydown);
    }
  };

  pointComponent.setRollupBtnClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onDocumentEscKeydown);
  });

  editFormComponent.setFormSubmitHandler((evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener('keydown', onDocumentEscKeydown);
  });

  editFormComponent.setResetBtnClickHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onDocumentEscKeydown);
  });

  render(container, pointComponent, RenderPosition.BEFOREEND);
};

points.forEach((point) => renderPoint(pointsListElement, point));
