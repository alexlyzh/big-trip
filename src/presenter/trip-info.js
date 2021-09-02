import TripInfoView from '../view/trip-info';
import {remove, render, RenderPosition, replace} from '../utils/render';
import {sortDayAscending} from '../utils/point';

export default class TripInfoPresenter {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._tripInfoComponent = null;

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevTripInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new TripInfoView(this._getPoints());

    if (!prevTripInfoComponent) {
      render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  _getPoints() {
    const points = this._pointsModel.getPoints().slice();
    return points.sort(sortDayAscending);
  }

  _handleModelEvent() {
    this.init();
  }
}
