import EventModel from '../models/event-model';
import TripEventComponent from '../components/trip-event';
import TripEventEditComponent from '../components/trip-event-edit';
import {renderComponent, replaceComponent, removeComponent, RenderPosition} from '../utils/render';
import {Mode, emptyEvent, ActionButtonText} from '../const';
import moment from 'moment';
import he from 'he';

const parseFormData = (formData, destinations) => {
  const offers = formData.getAll(`event-offer`)
    .map((title) => {
      const input = document.querySelector(`input[value="${title}"]`);

      return {
        title,
        price: parseInt(input.dataset.offerPrice, 10)
      };
    })
    .filter((offer) => offer !== null);

  const city = he.encode(formData.get(`event-destination`));
  const destination = destinations.find((item) => {
    return city === item.name;
  });

  const startDate = moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`).valueOf();
  const endDate = moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`).valueOf();
  const price = he.encode(formData.get(`event-price`));

  return new EventModel({
    'type': formData.get(`event-type`),
    'destination': destination,
    'offers': offers,
    'date_from': moment(startDate).toISOString(),
    'date_to': moment(endDate).toISOString(),
    'base_price': parseInt(price, 10),
    'is_favorite': formData.get(`event-favorite`) === `on`
  });
};

export default class EventController {
  constructor(container, onDataChange, onViewChange, destinations, offers) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._destinations = destinations;
    this._offers = offers;

    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, emptyEvent, null);
      }

      this._replaceEditToEvent();
    }
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);

    this._eventEditComponent.reset();

    if (document.contains(this._eventEditComponent.getElement())) {
      replaceComponent(this._eventComponent, this._eventEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _replaceEventToEdit() {
    this._onViewChange();

    replaceComponent(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  blockEditForm() {
    this._eventEditComponent.blockFormElements();
  }

  getMode() {
    return this._mode;
  }

  destroy() {
    removeComponent(this._eventEditComponent);
    removeComponent(this._eventComponent);

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  render(event, mode, isFavoriteChanged) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._mode = mode;

    this._eventComponent = new TripEventComponent(event);
    this._eventEditComponent = new TripEventEditComponent(event, this._mode, this._destinations, this._offers);

    this._eventComponent.setRollupButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, this._destinations);

      this._eventEditComponent.setButtonText({
        SAVE: ActionButtonText.SAVE
      });

      this._onDataChange(this, event, data);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      if (mode === Mode.ADDING) {
        this._onDataChange(this, emptyEvent, null);
      } else {
        this._eventEditComponent.setButtonText({
          DELETE: ActionButtonText.DELETE
        });

        this._onDataChange(this, event, null);
      }
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => this._replaceEditToEvent());

    this._eventEditComponent.setFavoriteCheckboxChangeHandler(() => {
      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !newEvent.isFavorite;

      this._onDataChange(this, event, newEvent);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replaceComponent(this._eventComponent, oldEventComponent);
          replaceComponent(this._eventEditComponent, oldEventEditComponent);

          if (!isFavoriteChanged) {
            this._replaceEditToEvent();
          }
        } else {
          renderComponent(this._container, this._eventComponent);
        }
        break;
      case Mode.ADDING:
        if (oldEventEditComponent && oldEventComponent) {
          removeComponent(oldEventComponent);
          removeComponent(oldEventEditComponent);
        }

        document.addEventListener(`keydown`, this._escKeyDownHandler);
        renderComponent(this._container, this._eventEditComponent, RenderPosition.AFTEREND);
        break;
    }
  }

  shake() {
    this._eventEditComponent.shake();
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }
}
