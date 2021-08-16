import {updateItem} from '../utils/common';
import PointsListView from '../view/points-list';
import SortFormView from '../view/sort-form';
import NoPointsView from '../view/no-points';
import {render, RenderPosition} from '../utils/render';
import PointPresenter from './point';

export default class TripPresenter {
  constructor(container, points) {
    this._container = container;
    this._points = [...points];
    this._pointsCount = this._points.length;
    this._pointPresenters = new Map();

    this._pointsListComponent = new PointsListView();
    this._sortFormComponent = new SortFormView(this._points);
    this._noPointsComponent = new NoPointsView();

    this._handlePointUpdate = this._handlePointUpdate.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init() {
    render(this._container, this._pointsListComponent);
    this._renderTrip();
  }

  _handlePointUpdate(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenters.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
    this._pointPresenters.forEach((presenter) => presenter.resetView());
  }

  _clearPointsList() {
    this._pointPresenters.forEach((point) => point.destroy());
    this._pointPresenters.clear();
  }

  _renderSort() {
    render(this._container, this._sortFormComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(container, point) {
    const pointPresenter = new PointPresenter(container, this._handlePointUpdate, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenters.set(point.id, pointPresenter);
  }

  _renderPoints() {
    this._points.forEach((point) => this._renderPoint(this._pointsListComponent, point));
  }

  _renderPointsList() {
    this._renderPoints();
    render(this._container, this._pointsListComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoints() {
    render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (!this._pointsCount) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPointsList();
  }
}
