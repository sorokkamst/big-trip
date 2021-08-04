import AbstractSmartComponent from './abstract-smart-component';
import {formatDate, formatTime} from '../utils/format';
import {toUpperCaseFirstLetter, formatEventTypePlaceholder} from '../utils/common';
import {DEBOUNCE_TIMEOUT, Mode, EventType, DefaultButtonText} from '../const';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';
import moment from 'moment';
import {nanoid} from 'nanoid';
import debounce from 'lodash/debounce';

const SHAKE_ANIMATION_TIMEOUT = 600;

const flatpickrOptions = {
  allowInput: true,
  dateFormat: `d/m/y H:i`,
  enableTime: true
};

const createDestinationsMarkup = (destinations) => {
  return destinations
    .map((destination) => {
      return `
        <option value="${destination.name}"></option>
      `;
    })
    .join(``);
};

const createEventTypesMarkup = (types, eventType) => {
  return types
    .map((type) => {
      return `
        <div class="event__type-item">
          <input
            id="event-type-${type}-1"
            class="event__type-input  visually-hidden"
            type="radio"
            name="event-type"
            value="${type}" ${type === eventType ? `checked` : ``}
          >
          <label
            class="event__type-label  event__type-label--${type}"
            for="event-type-${type}-1"
          >
            ${toUpperCaseFirstLetter(type)}
          </label>
        </div>
      `;
    })
    .join(``);
};

const createOffersMarkup = (eventType, eventOffers, offers) => {
  const allOffers = offers.find((offer) => {
    return eventType === (offer.type);
  });

  return allOffers.offers
    .map((offer) => {
      const offerId = nanoid();
      const checkedOffer = eventOffers
        .find((eventOffer) => eventOffer.title === offer.title);

      return `
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="event-offer-${offerId}"
            type="checkbox"
            name="event-offer"
            value="${offer.title}"
            ${checkedOffer ? `checked` : ``}
            data-offer-price="${checkedOffer ? checkedOffer.price : offer.price}"
          >
          <label
            class="event__offer-label"
            for="event-offer-${offerId}"
          >
            <span class="event__offer-title">
              ${offer.title}
            </span>
              &plus;
              &euro;&nbsp;
            <span class="event__offer-price">
              ${checkedOffer ? checkedOffer.price : offer.price}
            </span>
          </label>
        </div>
      `;
    })
    .join(``);
};

const createPicturesMarkup = (pictures) => {
  return pictures
    .map((picture) => {
      return `
        <img class="event__photo" src="${picture.src}" alt="${picture.description}">
      `;
    })
    .join(``);
};

export default class TripEventEdit extends AbstractSmartComponent {
  constructor(event, mode, destinations, offers) {
    super();

    this._event = event;
    this._type = event.type;
    this._destination = Object.assign({}, event.destination);
    this._price = event.price;
    this._startDate = event.startDate;
    this._endDate = event.endDate;
    this._mode = mode;
    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;

    this._buttonText = DefaultButtonText;
    this._destinations = destinations;
    this._offers = offers;

    this._applyFlatpickrs();
    this._subscribeOnEvents();

    this._deleteButtonClickHandler = null;
    this._submitHandler = null;
    this._rollupButtonClickHandler = null;
    this._favoriteCheckboxChangeHandler = null;

    this._isModeAdding = this._isModeAdding.bind(this);
  }

  _applyFlatpickrs() {
    this._deleteFlatpickrs();

    const element = this.getElement();
    const startTimeElement = element.querySelector(`#event-start-time-1`);
    const endTimeElement = element.querySelector(`#event-end-time-1`);

    this._flatpickrStartDate = flatpickr(startTimeElement,
        Object.assign(
            {},
            flatpickrOptions,
            {
              defaultDate: this._event.startDate,
              minDate: this._event.startDate < Date.now() ? this._event.startDate : `today`
            }
        )
    );

    this._flatpickrEndDate = flatpickr(endTimeElement,
        Object.assign(
            {},
            flatpickrOptions,
            {
              defaultDate: this._event.endDate,
              minDate: this._event.startDate
            }
        )
    );
  }

  _deleteFlatpickrs() {
    if (this._flatpickrStartDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrStartDate = null;
    }

    if (this._flatpickrEndDate) {
      this._flatpickrEndDate.destroy();
      this._flatpickrEndDate = null;
    }
  }

  _hasOffers() {
    return this._offers
      .find((offer) => {
        return this._type === (offer.type);
      }).offers.length !== 0;
  }

  _getFormElement() {
    const {offers, isFavorite} = this._event;
    const {name, description, pictures} = this._destination;

    const picturesMarkup = createPicturesMarkup(pictures);
    const offersMarkup = createOffersMarkup(this._type, offers, this._offers);
    const cities = createDestinationsMarkup(this._destinations);
    const {TRANSFERS, ACTIVITIES} = EventType;

    return `
      <form class="${this._isModeAdding() ? `trip-events__item` : ``} event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event ${this._type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${createEventTypesMarkup(TRANSFERS, this._type)}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${createEventTypesMarkup(ACTIVITIES, this._type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${formatEventTypePlaceholder(this._type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${cities}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
              value="${formatDate(this._startDate)} ${formatTime(this._startDate)}">
              &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
              value="${formatDate(this._endDate)} ${formatTime(this._endDate)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">
            ${this._buttonText.SAVE}
          </button>
          <button class="event__reset-btn" type="reset">
            ${this._isModeAdding() ? `${this._buttonText.CANCEL}` : `${this._buttonText.DELETE}`}
          </button>
          ${this._isModeAdding() ? `` : `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`}
        </header>

        ${this._isModeAdding() && description === `` ? `` : `
          <section class="event__details">

          ${this._hasOffers() ? `
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">
                ${offersMarkup}
              </div>
            </section>
          ` : ``}

            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${description}</p>

              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${picturesMarkup}
                </div>
              </div>
            </section>
          </section>
        `}
      </form>
    `;
  }

  _isModeAdding() {
    return this._mode === Mode.ADDING;
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const typeElement = element.querySelector(`.event__type-list`);
    const destinationElement = element.querySelector(`.event__input--destination`);
    const priceElement = element.querySelector(`.event__input--price`);
    const startTimeElement = element.querySelector(`#event-start-time-1`);
    const endTimeElement = element.querySelector(`#event-end-time-1`);

    typeElement.addEventListener(`change`, (evt) => {
      this._type = evt.target.value;

      this.rerender();
    });

    destinationElement.addEventListener(`input`, (evt) => {
      const destination = this._destinations.find((it) => {
        return it.name === evt.target.value;
      });

      if (!destination) {
        return;
      }

      this._destination = destination;
      this.rerender();
    });

    priceElement.addEventListener(`change`, (evt) => {
      this._price = parseInt(evt.target.value, 10);
    });

    startTimeElement.addEventListener(`change`, (evt) => {
      this._startDate = moment(evt.target.value, `DD/MM/YY HH:mm`).valueOf();

      const defaultDate = moment(this._endDate).isAfter(this._startDate)
        ? this._endDate : this._startDate;

      this._flatpickrEndDate = flatpickr(endTimeElement,
          Object.assign(
              {},
              flatpickrOptions,
              {
                defaultDate,
                minDate: this._startDate
              }
          )
      );
    });

    endTimeElement.addEventListener(`change`, (evt) => {
      this._endDate = moment(evt.target.value, `DD/MM/YY HH:mm`).valueOf();
    });
  }

  blockFormElements() {
    const form = this.getElement();

    form.querySelectorAll(`input`)
      .forEach((element) => (element.disabled = true));

    form.querySelectorAll(`button`)
      .forEach((element) => (element.disabled = true));
  }

  getData() {
    const form = this._isModeAdding()
      ? this.getElement()
      : this.getElement().querySelector(`.event--edit`);

    return new FormData(form);
  }

  getTemplate() {
    if (this._isModeAdding()) {
      return this._getFormElement();
    }

    return `<li class="trip-events__item">${this._getFormElement()}</li>`;
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this.setFavoriteCheckboxChangeHandler(this._favoriteCheckboxChangeHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  removeElement() {
    this._deleteFlatpickrs();
    super.removeElement();
  }

  rerender() {
    super.rerender();

    this.recoveryListeners();
    this._applyFlatpickrs();
  }

  reset() {
    const event = this._event;

    this._type = event.type;
    this._destination = Object.assign({}, event.destination);
    this._price = event.price;
    this._startDate = event.startDate;
    this._endDate = event.endDate;

    this.rerender();
  }

  setButtonText(data) {
    this._buttonText = Object.assign({}, DefaultButtonText, data);

    this.rerender();
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setFavoriteCheckboxChangeHandler(handler) {
    const element = this.getElement().querySelector(`.event__favorite-checkbox`);

    if (element) {
      element.addEventListener(`change`, debounce(handler, DEBOUNCE_TIMEOUT));
    }

    this._favoriteCheckboxChangeHandler = handler;
  }

  setRollupButtonClickHandler(handler) {
    const element = this.getElement().querySelector(`.event__rollup-btn`);

    if (element) {
      element.addEventListener(`click`, handler);
    }

    this._rollupButtonClickHandler = handler;
  }

  setSubmitHandler(handler) {
    const element = this._isModeAdding()
      ? this.getElement()
      : this.getElement().querySelector(`.event--edit`);
    element.addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  shake() {
    const element = this.getElement();

    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    element.style.outline = `2px solid red`;

    setTimeout(() => {
      element.style.animation = ``;

      this.setButtonText({
        SAVE: DefaultButtonText.SAVE,
        DELETE: DefaultButtonText.DELETE,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
