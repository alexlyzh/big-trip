import Abstract from './abstract.js';

const createLoadingTemplate = () => (
  '<p class="trip-events__msg">Loading...</p>'
);

export default class LoadingView extends Abstract {
  getTemplate() {
    return createLoadingTemplate();
  }
}
