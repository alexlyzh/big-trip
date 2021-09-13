import {FilterNames, UpdateType} from '../constants';
import {remove, replace, render, RenderPosition} from '../utils/render';
import FilterView from '../view/filter-view';
import {Filter} from '../utils/filter';

export default class FilterPresenter {
  constructor(container, filterModel, pointsModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getActive(), this._filterModel.disabled);
    this._filterComponent.setOnFilterChange(this._handleFilterChange);

    if (!prevFilterComponent) {
      render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    const points = this._pointsModel.getItems();

    return [
      {
        value: FilterNames.EVERYTHING,
        count: Filter[FilterNames.EVERYTHING](points).length,
      },
      {
        value: FilterNames.FUTURE,
        count: Filter[FilterNames.FUTURE](points).length,
      },
      {
        value: FilterNames.PAST,
        count: Filter[FilterNames.PAST](points).length,
      },
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterChange(filterType) {
    if (this._filterModel.getActive() === filterType) {
      return;
    }

    this._filterModel.setActive(UpdateType.MAJOR, filterType);
  }
}
