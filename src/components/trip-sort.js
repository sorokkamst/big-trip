import AbstractComponent from './abstract-component';
import {toUpperCaseFirstLetter} from '../utils/common';
import {SortType} from '../const';

const createSortMarkup = (sortType) => {
  return Object.values(sortType)
    .map((type, index) => {
      return `
        <div class="trip-sort__item  trip-sort__item--${type}">
          <input
            id="sort-${type}"
            class="trip-sort__input  visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-${type}"
            data-sort-type="${type}"
            ${index === 0 ? `checked` : ``}
          >
          <label
            class="trip-sort__btn"
            for="sort-${type}"
          >
            ${toUpperCaseFirstLetter(type)}
          </label>
        </div>
      `;
    })
    .join(``);
};

export default class TripSort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }
  getTemplate() {
    return `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <span class="trip-sort__item  trip-sort__item--day">Day</span>

        ${createSortMarkup(SortType)}

        <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
      </form>
    `;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      if (this._currenSortType === evt.target.dataset.sortType) {
        return;
      }

      this._currenSortType = evt.target.dataset.sortType;

      this.getElement()
        .querySelector(`.trip-sort__item--day`)
        .textContent = this._currenSortType === SortType.DEFAULT ? `Day` : ``;

      handler(this._currenSortType);
    });
  }
}
