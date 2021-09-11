import {remove, render, RenderPosition} from './utils/render.js';
import {FilterNames, MenuItem, UpdateType} from './constants';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import TripInfoPresenter from './presenter/trip-info';
import Statistics from './view/statistics';
import Api from './api/api';
import MenuTabsPresenter from './presenter/menu-tabs';
import PointDataModel from './model/point-data';
import Store from './api/store';
import Provider from './api/provider';
import {isOnline} from './utils/common';
import {toast} from './utils/toast';

const AUTHORIZATION = 'Basic jscfaisujcgrxpza';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiProvider = new Provider(api, store);

const tripMainElement = document.querySelector('.trip-main');
const tripNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const newPointBtnElement = tripMainElement.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const pointDataModel = new PointDataModel();
const filterModel = new FilterModel();
const menuTabsPresenter = new MenuTabsPresenter(tripNavigationElement, pointsModel);
const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, pointDataModel, filterModel, apiProvider);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
let statisticsComponent = null;

const onMenuItemClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_POINT:
      if (!isOnline()) {
        toast('You can\'t create new point offline');
        return;
      }
      menuTabsPresenter.changeTab(MenuItem.TABLE);
      remove(statisticsComponent);
      tripPresenter.destroy();
      filterModel.setActive(UpdateType.MAJOR, FilterNames.EVERYTHING);
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
      statisticsComponent = new Statistics(pointsModel.getItems());
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

newPointBtnElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  onMenuItemClick(evt.target.dataset.menuItem);
});

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();

Promise.all([
  apiProvider.getOffers(),
  apiProvider.getDestinations(),
  apiProvider.getPoints(),
])
  .then((response) => {
    const [offers, destinations, points] = response;

    newPointBtnElement.disabled = false;
    pointDataModel.setOffers(UpdateType.MINOR, offers);
    pointDataModel.setDestinations(UpdateType.MINOR, destinations);
    pointsModel.setItems(UpdateType.INIT, points);
    menuTabsPresenter.init(onMenuItemClick);
  })
  .catch((err) => {
    tripPresenter.showError();
    throw new Error(err);
  });

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  toast('You\'re offline');
});
