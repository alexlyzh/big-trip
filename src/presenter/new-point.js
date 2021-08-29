import {EditFormMode, UpdateType, UserAction} from '../constants';
import {generateID, isEsc} from '../utils/common';
import {remove, render, RenderPosition} from '../utils/render';
import EditFormView from '../view/edit-form';

export default class NewPointPresenter {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;
    this._createBtnElement = null;

    this._editFormComponent = null;

    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onCancelBtnClick = this._onCancelBtnClick.bind(this);
    this._onDocumentEstKeydown = this._onDocumentEstKeydown.bind(this);
  }

  init(createBtnElement) {
    this._createBtnElement = createBtnElement;

    if (this._editFormComponent) {
      return;
    }

    this._editFormComponent = new EditFormView(null, EditFormMode.CREATE);
    this._editFormComponent.setOnFormSubmit(this._onFormSubmit);
    this._editFormComponent.setOnResetBtnClick(this._onCancelBtnClick);

    render(this._container, this._editFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._onDocumentEstKeydown);
    this._createBtnElement.disabled = true;
  }

  destroy() {
    if (!this._editFormComponent) {
      return;
    }

    remove(this._editFormComponent);
    this._editFormComponent = null;

    document.removeEventListener('keydown', this._onDocumentEstKeydown);
    this._createBtnElement.disabled = false;
  }

  _onFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign({id: generateID()}, point),
    );

    this.destroy();
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
