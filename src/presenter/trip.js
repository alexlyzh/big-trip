import PointsListView from '../view/points-list';
import SortFormView from '../view/sort-form';
import NoPointsView from '../view/no-points';
import {remove, render, RenderPosition, replace} from '../utils/render';
import PointPresenter from './point';
import {SortParameters, UpdateType, UserAction} from '../constants';
import {sortDayAscending, sortDurationDescending, sortPriceDescending} from '../utils/point';

export default class TripPresenter {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._pointPresenters = new Map();
    this._currentSortType = SortParameters.DAY.value;

    this._pointsListComponent = null;
    this._sortFormComponent = null;
    this._noPointsComponent = new NoPointsView();

    this.init = this.init.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._getPoints();

    const prevPointsListComponent = this._pointsListComponent;

    this._pointsListComponent = new PointsListView();

    if (!prevPointsListComponent) {
      this._renderTrip();
      return;
    }

    replace(this._pointsListComponent, prevPointsListComponent);
    remove(prevPointsListComponent);

    this._renderTrip();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortParameters.PRICE.value:
        this._pointsModel.points.sort(sortPriceDescending);
        break;
      case SortParameters.TIME.value:
        this._pointsModel.points.sort(sortDurationDescending);
        break;
      case SortParameters.DAY.value:
        this._pointsModel.points.sort(sortDayAscending);
        break;
    }

    return this._pointsModel.points;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH: // - обновить часть списка (например, когда поменялось описание)
        this._pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR: // - обновить список (например, когда задача ушла в архив)
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR: // - обновить всю доску (например, при переключении фильтра)
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
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

  _renderSort() {
    if (this._sortFormComponent) {
      this._sortFormComponent = null;
    }

    this._sortFormComponent = new SortFormView(this._currentSortType);
    this._sortFormComponent.setOnSortTypeChange(this._handleSortTypeChange);
    render(this._container, this._sortFormComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handleViewAction, this._handleModeChange, this.init);
    pointPresenter.init(point);
    this._pointPresenters.set(point.id, pointPresenter);
  }

  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }

  _renderPointsList() {
    this._renderPoints(this._getPoints());
    render(this._container, this._pointsListComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoints() {
    render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (!this._getPoints().length) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPointsList();
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointPresenters.forEach((presenter) => presenter.destroy());
    this._pointPresenters.clear();

    remove(this._sortFormComponent);
    remove(this._noPointsComponent);

    if (resetSortType) {
      this._currentSortType = SortParameters.DAY.value;
    }
  }
}
