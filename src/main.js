import {remove, render, RenderPosition} from './utils/render.js';
import {FilterNames, MenuItem, UpdateType} from './constants';
import MenuTabsView from './view/menu-tabs.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';
import Statistics from './view/statistics';
import Api from './api';
import MenuTabsPresenter from './presenter/menu-tabs';

const AUTHORIZATION = 'Basic jATmAJ2luXVtgXoU123';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const newPointBtnElement = tripMainElement.querySelector('.trip-main__event-add-btn');
newPointBtnElement.disabled = true;

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const menuTabsPresenter = new MenuTabsPresenter(tripNavigationElement);
const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel, api);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
let statisticsComponent = null;

const onMenuItemClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_POINT:
      menuTabsPresenter.changeTab(MenuItem.TABLE);
      remove(statisticsComponent);
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterNames.EVERYTHING);
      filterModel.disabled = false;
      tripPresenter.init();
      tripPresenter.createPoint(newPointBtnElement);
      newPointBtnElement.disabled = true;
      break;
    case MenuItem.TABLE:
      filterModel.disabled = false;
      tripPresenter.init();
      menuTabsPresenter.changeTab(MenuItem.TABLE);
      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      filterModel.disabled = true;
      tripPresenter.destroy();
      menuTabsPresenter.changeTab(MenuItem.STATS);
      statisticsComponent = new Statistics(pointsModel.getPoints());
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const activateMenu = () => {
  menuTabsPresenter.init(onMenuItemClick);
  newPointBtnElement.disabled = false;
};

tripMainElement.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  onMenuItemClick(evt.target.dataset.menuItem);
});

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    activateMenu();
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    activateMenu();
  });
