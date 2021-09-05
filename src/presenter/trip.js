import PointsListView from '../view/points-list';
import SortFormView from '../view/sort-form';
import NoPointsView from '../view/no-points';
import LoadingView from '../view/loading';
import LoadingErrorView from '../view/loading-error';
import PointPresenter, { State as PointPresenterViewState } from './point';
import NewPointPresenter from './new-point';
import {remove, render, RenderPosition} from '../utils/render';
import {SortParameters, UpdateType, UserAction} from '../constants';
import {sortDayAscending, sortDurationDescending, sortPriceDescending} from '../utils/point';
import {Filter} from '../utils/filter';

export default class TripPresenter {
  constructor(pointsContainer, pointsModel, pointDataModel, filterModel, api) {
    this._pointsContainer = pointsContainer;
    this._pointsModel = pointsModel;
    this._pointDataModel = pointDataModel;
    this._filterModel = filterModel;
    this._filter = this._filterModel.getActive();
    this._pointPresenters = new Map();
    this._currentSortType = SortParameters.DAY.value;
    this._isLoading = true;
    this._api = api;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsListComponent = new PointsListView();
    this._newPointPresenter = new NewPointPresenter(this._pointsListComponent, this._pointDataModel, this._handleViewAction);
    this._loadingComponent = new LoadingView();
    this._loadingErrorComponent = new LoadingErrorView();
    this._sortFormComponent = null;
    this._noPointsComponent = null;
  }

  init() {
    render(this._pointsContainer, this._pointsListComponent, RenderPosition.BEFOREEND);
    this._renderTrip();

    this._pointDataModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  showError() {
    this._isLoading = false;
    remove(this._loadingComponent);
    render(this._pointsContainer, this._loadingErrorComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._pointsListComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(createBtnElement) {
    this._newPointPresenter.init(createBtnElement);
  }

  _getPoints() {
    this._filter = this._filterModel.getActive();
    const points = this._pointsModel.getItems();
    const filteredPoints = Filter[this._filter](points);

    switch (this._currentSortType) {
      case SortParameters.PRICE.value:
        filteredPoints.sort(sortPriceDescending);
        break;
      case SortParameters.TIME.value:
        filteredPoints.sort(sortDurationDescending);
        break;
      case SortParameters.DAY.value:
        filteredPoints.sort(sortDayAscending);
        break;
    }

    return filteredPoints;
  }

  _renderSort() {
    if (this._sortFormComponent) {
      remove(this._sortFormComponent);
      this._sortFormComponent = null;
    }

    this._sortFormComponent = new SortFormView(this._currentSortType);
    this._sortFormComponent.setOnSortTypeChange(this._handleSortTypeChange);
    render(this._pointsContainer, this._sortFormComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._pointsContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, this._pointDataModel.getOffers(), this._pointDataModel.getDestinations());
    this._pointPresenters.set(point.id, pointPresenter);
  }

  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }

  _renderNoPoints() {
    this._noPointsComponent = new NoPointsView(this._filter);
    remove(this._loadingComponent);
    render(this._pointsContainer, this._noPointsComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();
    if (!points.length) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints(points);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._newPointPresenter.destroy();
    this._pointPresenters.forEach((presenter) => presenter.destroy());
    this._pointPresenters.clear();

    remove(this._sortFormComponent);
    remove(this._noPointsComponent);

    if (resetSortType) {
      this._currentSortType = SortParameters.DAY.value;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenters.get(update.id).setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then(((response) => this._pointsModel.update(updateType, response)))
          .catch(() => this._pointPresenters.get(update.id).setViewState(PointPresenterViewState.ABORTING));
        break;
      case UserAction.ADD_POINT:
        this._newPointPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => this._pointsModel.add(updateType, response))
          .catch(() => this._newPointPresenter.setAborting());
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenters.get(update.id).setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => this._pointsModel.delete(updateType, update))
          .catch(() => this._pointPresenters.get(update.id).setViewState(PointPresenterViewState.ABORTING));
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH: // - обновить часть списка (например, когда изменены выбранные доп. предложения)
        this._pointPresenters.get(data.id).init(data, this._pointDataModel.getOffers(), this._pointDataModel.getDestinations());
        break;
      case UpdateType.MINOR: // - обновить список (например, когда изменились даты в точке путешествия)
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR: // - обновить всю доску (например, при переключении фильтра)
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT: // - при инициализации проложения
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._newPointPresenter.destroy();
    this._pointPresenters.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }
}
