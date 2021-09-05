import PointView from '../view/point';
import EditFormView from '../view/edit-form';
import {render, replace, remove, RenderPosition} from '../utils/render';
import {isEsc} from '../utils/common';
import {UpdateType, UserAction} from '../constants';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._editFormComponent = null;
    this._point = null;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handlePointRollupClick = this._handlePointRollupClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleResetBtnClick = this._handleResetBtnClick.bind(this);
    this._handleFormRollupClick = this._handleFormRollupClick.bind(this);
    this._onDocumentEscKeydown = this._onDocumentEscKeydown.bind(this);
  }

  init(point, offers, destinations) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevEditFormComponent = this._editFormComponent;

    this._pointComponent = new PointView(point);
    this._editFormComponent = new EditFormView(point, offers, destinations);

    this._pointComponent.setOnRollupBtnClick(this._handlePointRollupClick);
    this._pointComponent.setOnFavoriteBtnClick(this._handleFavoriteClick);
    this._editFormComponent.setOnFormSubmit(this._handleFormSubmit);
    this._editFormComponent.setOnRollupBtnClick(this._handleFormRollupClick);
    this._editFormComponent.setOnResetBtnClick(this._handleResetBtnClick);

    if (!prevPointComponent || !prevEditFormComponent) {
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

  _handleFormSubmit(update) {
    const isPatch = this._point.dateFrom === update.dateFrom &&
      this._point.dateTo === update.dateTo &&
      this._point.basePrice === update.basePrice;

    this._changeData(
      UserAction.UPDATE_POINT,
      isPatch ? UpdateType.PATCH : UpdateType.MINOR,
      update);

    this._replaceFormToPoint();
  }

  _handleResetBtnClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleFavoriteClick() {
    this._changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
  }

  _handlePointRollupClick() {
    this._replacePointToForm();
  }

  _handleFormRollupClick() {
    this._editFormComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _onDocumentEscKeydown(evt) {
    if (isEsc(evt)) {
      evt.preventDefault();
      this._editFormComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }
}
