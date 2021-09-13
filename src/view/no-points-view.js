import Abstract from './abstract.js';
import {NoPointsTexts} from '../constants';

export default class NoPointsView extends Abstract {
  constructor(currentFilter) {
    super();
    this._filter = currentFilter;
  }

  getTemplate() {
    return `<p class="trip-events__msg">${NoPointsTexts[this._filter]}</p>`;
  }
}
