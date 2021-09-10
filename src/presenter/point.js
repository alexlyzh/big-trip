import PointView from '../view/point';
import EditFormView from '../view/edit-form';
import {render, replace, remove, RenderPosition} from '../utils/render';
import {isEsc, isOnline} from '../utils/common';
import {UpdateType, UserAction} from '../constants';
import {toast} from '../utils/toast';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
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
      replace(this._pointComponent, prevEditFormComponent);
      this._mode = Mode.DEFAULT;
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

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._editFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._editFormComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._editFormComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._editFormComponent.shake(resetFormState);
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
    if (!isOnline()) {
      toast('You can\'t save point offline');
      return;
    }

    const isPatch = this._point.dateFrom === update.dateFrom &&
      this._point.dateTo === update.dateTo &&
      this._point.basePrice === update.basePrice;

    this._changeData(
      UserAction.UPDATE_POINT,
      isPatch ? UpdateType.PATCH : UpdateType.MINOR,
      update);
  }

  _handleResetBtnClick(point) {
    if (!isOnline()) {
      toast('You can\'t delete point offline');
      return;
    }

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
    if (!isOnline()) {
      toast('You can\'t edit point offline');
      return;
    }

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
