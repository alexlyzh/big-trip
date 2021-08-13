import PointsListView from '../view/points-list';
import SortFormView from '../view/sort-form';
import NoPoints from '../view/no-points';
import {render, replace, RenderPosition} from '../utils/render';
import EditFormView from '../view/edit-form';
import {isEsc} from '../utils/common';
import PointView from '../view/point';

export default class TripPresenter {
  constructor(container, points) {
    this._container = container;
    this._points = [...points];
    this._pointsCount = this._points.length;

    this._pointsListComponent = new PointsListView();
    this._sortFormComponent = new SortFormView(this._points);
    this._noPointsComponent = new NoPoints();
  }

  init() {
    render(this._container, this._pointsListComponent);
    this._renderTrip();
  }

  _renderSort() {
    render(this._container, this._sortFormComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(container, point) {
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

    const closeEditForm = () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onDocumentEscKeydown);
    };

    pointComponent.setRollupBtnClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onDocumentEscKeydown);
    });

    editFormComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      closeEditForm();
    });

    editFormComponent.setResetBtnClickHandler(() => {
      closeEditForm();
    });

    render(container, pointComponent, RenderPosition.BEFOREEND);
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
