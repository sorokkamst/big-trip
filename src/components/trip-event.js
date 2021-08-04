import AbstractComponent from './abstract-component';
import {formatDateTime, formatTime, formatDuration} from '../utils/format';
import {formatEventTypePlaceholder} from '../utils/common';

const OFFERS_MAX_VIEWING = 3;

const createOffersMarkup = (offers) => {
  return offers
    .slice(0, OFFERS_MAX_VIEWING)
    .map((offer) => {
      return `
        <li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
            &plus;
            &euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>
      `;
    })
    .join(``);
};

export default class TripEvent extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    const {type, offers, destination, startDate, endDate, price} = this._event;

    const offersMarkup = createOffersMarkup(offers);

    const startTime = formatTime(startDate);
    const endTime = formatTime(endDate);
    const startDateTime = formatDateTime(startDate);
    const endDateTime = formatDateTime(endDate);
    const duration = formatDuration(endDate - startDate);

    return `
      <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
        </div>
        <h3 class="event__title">${formatEventTypePlaceholder(type)} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDateTime}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDateTime}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
      </li>
    `;
  }

  setRollupButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
