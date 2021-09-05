import {EditFormMode, UpdateType, UserAction} from '../constants';
import {isEsc} from '../utils/common';
import {remove, render, RenderPosition} from '../utils/render';
import EditFormView from '../view/edit-form';

export default class NewPointPresenter {
  constructor(container, pointDataModel, changeData) {
    this._container = container;
    this._changeData = changeData;
    this._pointDataModel = pointDataModel;
    this._createBtnElement = null;
    this._editFormComponent = null;

    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onCancelBtnClick = this._onCancelBtnClick.bind(this);
    this._onDocumentEstKeydown = this._onDocumentEstKeydown.bind(this);
  }

  init(createBtnElement) {
    if (this._editFormComponent) {
      return;
    }

    this._editFormComponent = new EditFormView(null, this._pointDataModel.getOffers(), this._pointDataModel.getDestinations(), EditFormMode.CREATE);
    this._editFormComponent.setOnFormSubmit(this._onFormSubmit);
    this._editFormComponent.setOnResetBtnClick(this._onCancelBtnClick);

    render(this._container, this._editFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._onDocumentEstKeydown);
    this._createBtnElement = createBtnElement;
  }

  destroy() {
    if (!this._editFormComponent) {
      return;
    }

    if (this._createBtnElement) {
      this._createBtnElement.disabled = false;
    }

    remove(this._editFormComponent);
    this._editFormComponent = null;

    document.removeEventListener('keydown', this._onDocumentEstKeydown);
  }

  setSaving() {
    this._editFormComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._editFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._editFormComponent.shake(resetFormState);
  }

  _onFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _onCancelBtnClick() {
    this.destroy();
  }

  _onDocumentEstKeydown(evt) {
    if (isEsc(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
