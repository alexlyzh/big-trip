import PointView from '../view/point';
import EditFormView from '../view/edit-form';
import {render, replace, RenderPosition} from '../utils/render';
import {isEsc} from '../utils/common';

export default class PointPresenter {
  constructor(container) {
    this._container = container;

    this._pointComponent = null;
    this._editFormComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._onDocumentEscKeydown = this._onDocumentEscKeydown.bind(this);
  }

  init(point) {
    this._point = point;

    this._pointComponent = new PointView(point);
    this._editFormComponent = new EditFormView(point);

    this._pointComponent.setRollupBtnClickHandler(this._handleEditClick);
    this._editFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editFormComponent.setResetBtnClickHandler(this._handleResetBtnClick);

    render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
  }

  _replacePointToForm() {
    replace(this._editFormComponent, this._pointComponent);
    document.addEventListener('keydown', this._onDocumentEscKeydown);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._editFormComponent);
    document.removeEventListener('keydown', this._onDocumentEscKeydown);
  }

  _onDocumentEscKeydown(evt) {
    if (isEsc(evt)) {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleFormSubmit() {
    this._replaceFormToPoint();
  }

  _handleResetBtnClick() {
    this._replaceFormToPoint();
  }
}
