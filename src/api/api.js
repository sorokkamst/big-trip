import EventModel from '../models/event-model';
import {RequestMethod} from '../const';

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  _load({url, method = RequestMethod.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  createEvent(event) {
    return this._load({
      url: `points`,
      method: RequestMethod.POST,
      body: JSON.stringify(event.toRaw()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(EventModel.parseEvent);
  }

  deleteEvent(id) {
    return this._load({url: `points/${id}`, method: RequestMethod.DELETE});
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then((response) => response.json());
  }

  getEvents() {
    return this._load({url: `points`})
      .then((response) => response.json())
      .then(EventModel.parseEvents);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then((response) => response.json());
  }

  sync(data) {
    return this._load({
      url: `points/sync`,
      method: RequestMethod.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  updateEvent(id, data) {
    return this._load({
      url: `points/${id}`,
      method: RequestMethod.PUT,
      body: JSON.stringify(data.toRaw()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(EventModel.parseEvent);
  }
}
