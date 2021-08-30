import {render, RenderPosition} from './utils/render.js';
import {FilterNames, MenuItem, UpdateType} from './constants';
import MenuTabsView from './view/menu-tabs.js';
import {getPointsList} from './mock/point.js';
import {generateID} from './utils/common.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';
import Statistics from './view/statistics';

const POINTS_COUNT = 20;

const getAuthorizationID = () => `Basic ${generateID()}`;
getAuthorizationID();

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const points = getPointsList(POINTS_COUNT);

const pointsModel = new PointsModel();
pointsModel.points = points;

const menuTabsComponent = new MenuTabsView();

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
const statisticsComponent = new Statistics(pointsModel.points);

const onNewPointFormClose = () => {
  tripMainElement.querySelector('.trip-main__event-add-btn').disabled = false;
  menuTabsComponent.setActiveTab(MenuItem.TABLE);
};

const onMenuItemClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_POINT:
      // Скрыть статистику
      tripPresenter.destroy(); // Почему без этой строчки при открытии формы создания точки ломается сортировка и фильтрация?
      filterModel.setFilter(UpdateType.MAJOR, FilterNames.EVERYTHING);
      tripPresenter.init();
      tripPresenter.createPoint(onNewPointFormClose);
      tripMainElement.querySelector('.trip-main__event-add-btn').disabled = true;
      break;
    case MenuItem.TABLE:
      tripPresenter.init();
      menuTabsComponent.setActiveTab(MenuItem.TABLE);
      // Скрыть статистику
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      menuTabsComponent.setActiveTab(MenuItem.STATS);
      // Показать статистику
      break;
  }
};

menuTabsComponent.setOnTabClick(onMenuItemClick);
render(tripNavigationElement, menuTabsComponent, RenderPosition.BEFOREEND);

tripMainElement.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  onMenuItemClick(evt.target.dataset.menuItem);
});

tripInfoPresenter.init();
filterPresenter.init();
//tripPresenter.init();

render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
