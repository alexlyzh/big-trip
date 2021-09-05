import Abstract from './abstract.js';

const createLoadingErrorTemplate = () => (
  '<p class="trip-events__msg">Data loading error</p>'
);

export default class LoadingErrorView extends Abstract {
  getTemplate() {
    return createLoadingErrorTemplate();
  }
}
