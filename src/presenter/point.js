import PointView from '../view/point';
import EditFormView from '../view/edit-form';
import {render, replace, remove, RenderPosition} from '../utils/render';
import {isEsc} from '../utils/common';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  constructor(container, updatePoint, changeMode) {
    this._container = container;
    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._editFormComponent = null;
    this._updatePoint = updatePoint;
    this._changeMode = changeMode;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleResetBtnClick = this._handleResetBtnClick.bind(this);
    this._onDocumentEscKeydown = this._onDocumentEscKeydown.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevEditFormComponent = this._editFormComponent;

    this._pointComponent = new PointView(point);
    this._editFormComponent = new EditFormView(point);

    this._pointComponent.setOnRollupBtnClick(this._handleEditClick);
    this._pointComponent.setOnFavoriteBtnClick(this._handleFavoriteClick);
    this._editFormComponent.setOnFormSubmit(this._handleFormSubmit);
    this._editFormComponent.setOnResetBtnClick(this._handleResetBtnClick);

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    } else if (this._mode === Mode.EDITING) {
      replace(this._editFormComponent, prevEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editFormComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _handleFormSubmit(point) {
    this._updatePoint(point);
    this._replaceFormToPoint();
  }

  _handleFavoriteClick() {
    this._updatePoint(Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleResetBtnClick() {
    this._editFormComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _replacePointToForm() {
    replace(this._editFormComponent, this._pointComponent);
    document.addEventListener('keydown', this._onDocumentEscKeydown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._editFormComponent);
    document.removeEventListener('keydown', this._onDocumentEscKeydown);
    this._mode = Mode.DEFAULT;
  }

  _onDocumentEscKeydown(evt) {
    if (isEsc(evt)) {
      evt.preventDefault();
      this._editFormComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }
}
