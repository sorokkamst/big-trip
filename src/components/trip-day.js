import AbstractComponent from './abstract-component';
import {formatFullDate, formatMonth, formatDay} from '../utils/format';

export default class TripDay extends AbstractComponent {
  constructor(date = null, count = 0) {
    super();
    this._date = date;
    this._count = count;
  }

  getTemplate() {
    const month = this._date ? formatMonth(this._date) : ``;
    const day = this._date ? formatDay(this._date) : ``;
    const datetime = this._date ? formatFullDate(this._date) : ``;

    return `
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${this._count || ``}</span>
          <time class="day__date" datetime="${datetime}">
            ${month} ${day}
          </time>
        </div>
      </li>
    `;
  }
}
