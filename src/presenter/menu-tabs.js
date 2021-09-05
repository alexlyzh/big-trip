import MenuTabsView from '../view/menu-tabs';
import {remove, render, RenderPosition, replace} from '../utils/render';

export default class MenuTabsPresenter {
  constructor(tabsContainer, pointsModel) {
    this._tabsContainer = tabsContainer;
    this._pointsModel = pointsModel;
    this._isDisabled = true;
    this._callback = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._tabsComponent = new MenuTabsView(this._isDisabled);
    render(this._tabsContainer, this._tabsComponent, RenderPosition.BEFOREEND);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init(callback) {
    this._isDisabled = !this._pointsModel.getItems().length;

    if (callback) {
      this._callback = callback;
    }

    const prevTabsComponent = this._tabsComponent;
    this._tabsComponent = new MenuTabsView(this._isDisabled);
    !this._isDisabled && this._tabsComponent.setOnTabClick(this._callback);

    replace(this._tabsComponent, prevTabsComponent);
    remove(prevTabsComponent);
  }

  changeTab(menuItem) {
    this._tabsComponent.setActiveTab(menuItem);
  }

  _handleModelEvent() {
    this.init();
  }
}
