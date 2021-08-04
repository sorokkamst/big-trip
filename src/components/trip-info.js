import AbstractSmartComponent from './abstract-smart-component';
import {formatMonth, formatDay} from '../utils/format';

const SHOWING_CITIES_COUNT = 3;

const getDates = (startDate, endDate) => {
  const startMonth = formatMonth(startDate);
  const endMonth = startMonth !== formatMonth(endDate) ? formatMonth(endDate) : ``;
  const startDay = formatDay(startDate);
  const endDay = formatDay(endDate);

  return `${startMonth} ${startDay} &nbsp;&mdash;&nbsp; ${endMonth} ${endDay}`;
};

const getTitle = (events) => {
  if (events.length > SHOWING_CITIES_COUNT) {
    return `
      ${events[0].destination.name} &mdash; ... &mdash; ${events[events.length - 1].destination.name}
    `;
  } else {
    return events
      .map((event, index) => {
        return `${event.destination.name} ${index < events.length - 1 ? `-` : ``} `;
      })
      .join(``);
  }
};

export default class TripInfo extends AbstractSmartComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    if (this._events.length === 0) {
      return `<div class="trip-info__main"></div>`;
    }

    const dates = getDates(this._events[0].startDate, this._events[this._events.length - 1].startDate);

    return `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getTitle(this._events)}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>
    `;
  }

  setValue(events) {
    this._events = events.slice().sort((a, b) => a.startDate - b.startDate);

    super.rerender();
  }
}
