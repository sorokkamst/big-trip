import FilterComponent from '../components/filter';
import {replaceComponent, renderComponent} from '../utils/render';
import {FilterType} from '../const';
import {getEventsByFilter} from '../utils/filter';

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  hide() {
    this._filterComponent.hide();
  }

  render() {
    const container = this._container;
    const events = this._eventsModel.getEventsAll();

    const filters = Object.values(FilterType)
      .map((filterType) => {
        return {
          name: filterType,
          checked: filterType === this._activeFilterType,
          disabled: getEventsByFilter(events, filterType).length === 0
        };
      });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replaceComponent(this._filterComponent, oldComponent);
    } else {
      renderComponent(container, this._filterComponent);
    }
  }

  show() {
    this._filterComponent.show();
  }
}
