import {FilterNames, UpdateType} from '../constants';
import {remove, replace, render, RenderPosition} from '../utils/render';
import FilterView from '../view/filters-form';
import {filter} from '../utils/filter';

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

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setOnFilterChange(this._handleFilterChange);

    if (prevFilterComponent === null) {
      render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const points = this._pointsModel.points;

    return [
      {
        value: FilterNames.EVERYTHING,
        count: filter[FilterNames.EVERYTHING](points).length,
      },
      {
        value: FilterNames.FUTURE,
        count: filter[FilterNames.FUTURE](points).length,
      },
      {
        value: FilterNames.PAST,
        count: filter[FilterNames.PAST](points).length,
      },
    ];
  }
}
