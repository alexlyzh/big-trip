import AbstractObserver from '../utils/abstract-observer';
import {FilterNames} from '../constants';

export default class FilterModel extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterNames.EVERYTHING;
    this._isDisabled = false;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType);
  }

  getFilter() {
    return this._activeFilter;
  }

  set disabled(isDisabled) {
    this._isDisabled = isDisabled;
  }

  get disabled() {
    return this._isDisabled;
  }
}
