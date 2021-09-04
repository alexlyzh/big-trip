import {remove, render, RenderPosition} from './utils/render.js';
import {FilterNames, MenuItem, UpdateType} from './constants';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';
import Statistics from './view/statistics';
import Api from './api';
import MenuTabsPresenter from './presenter/menu-tabs';
import PointDataModel from './model/point-data';

const AUTHORIZATION = 'Basic jxcfbisujcgrzmpz';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const newPointBtnElement = tripMainElement.querySelector('.trip-main__event-add-btn');
newPointBtnElement.disabled = true;

const pointsModel = new PointsModel();
const pointDataModel = new PointDataModel();
const filterModel = new FilterModel();
const menuTabsPresenter = new MenuTabsPresenter(tripNavigationElement);
const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, pointDataModel, filterModel, api);
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

const activateMenu = (pointsNumber) => {
  menuTabsPresenter.init(onMenuItemClick, pointsNumber);
  newPointBtnElement.disabled = false;
};

newPointBtnElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  onMenuItemClick(evt.target.dataset.menuItem);
});

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();

Promise.all([
  api.getOffers(),
  api.getDestinations(),
])
  .then((response) => {
    pointDataModel.setOffers(UpdateType.MINOR, response[0]);
    pointDataModel.setDestinations(UpdateType.MINOR, response[1]);
  })
  .finally(() => {
    api.getPoints()
      .then((points) => {
        pointsModel.setPoints(UpdateType.INIT, points);
        activateMenu(pointsModel.getPoints().length);
      })
      .catch(() => {
        pointsModel.setPoints(UpdateType.INIT, []);
        activateMenu(pointsModel.getPoints().length);
      });
  });


