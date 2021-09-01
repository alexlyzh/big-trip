import Abstract from './abstract.js';
import {MenuItem} from '../constants';
import {capitalize} from '../utils/common';

const ACTIVE_TAB_CLASSNAME = 'trip-tabs__btn--active';

export default class MenuTabsView extends Abstract {
  constructor() {
    super();
    this._activeTab = MenuItem.TABLE;

    this._onTabClick = this._onTabClick.bind(this);
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs trip-tabs">
             <a class="trip-tabs__btn ${this._activeTab === MenuItem.TABLE ? ACTIVE_TAB_CLASSNAME : ''}" href="#" data-menu-item="${MenuItem.TABLE}">${capitalize(MenuItem.TABLE)}</a>
             <a class="trip-tabs__btn ${this._activeTab === MenuItem.STATS ? ACTIVE_TAB_CLASSNAME : ''}" href="#" data-menu-item="${MenuItem.STATS}">${capitalize(MenuItem.STATS)}</a>
           </nav>`;
  }

  setOnTabClick(callback) {
    this._callback.onTabClick = callback;
    this.getElement().addEventListener('click', this._onTabClick);
  }

  _onTabClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'A') {
      return;
    }

    if (evt.target.dataset.menuItem === this._activeTab) {
      return;
    }

    this._callback.onTabClick(evt.target.dataset.menuItem);
  }

  setActiveTab(menuItem) {
    this._activeTab = menuItem;
    const items = Array.from(this.getElement().querySelectorAll('a'));
    items.forEach((item) => item.classList.toggle(ACTIVE_TAB_CLASSNAME, item.dataset.menuItem === menuItem));
  }
}
