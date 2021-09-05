import MenuTabsView from '../view/menu-tabs';
import {remove, render, RenderPosition, replace} from '../utils/render';

export default class MenuTabsPresenter {
  constructor(tabsContainer) {
    this._tabsContainer = tabsContainer;
    this._isDisabled = true;

    this._tabsComponent = new MenuTabsView(this._isDisabled);
    render(this._tabsContainer, this._tabsComponent, RenderPosition.BEFOREEND);
  }

  init(callback) {
    this._isDisabled = false;

    if (this._isDisabled) {
      return;
    }

    const prevTabsComponent = this._tabsComponent;
    this._tabsComponent = new MenuTabsView(this._isDisabled);
    this._tabsComponent.setOnTabClick(callback);

    replace(this._tabsComponent, prevTabsComponent);
    remove(prevTabsComponent);
  }

  changeTab(menuItem) {
    this._tabsComponent.setActiveTab(menuItem);
  }
}
