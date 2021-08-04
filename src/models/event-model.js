import moment from 'moment';

export default class EventModel {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.destination = data[`destination`];
    this.offers = data[`offers`] || [];
    this.startDate = moment(data[`date_from`]).valueOf();
    this.endDate = moment(data[`date_to`]).valueOf();
    this.price = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRaw() {
    return {
      'id': this.id,
      'type': this.type,
      'destination': this.destination,
      'offers': this.offers,
      'date_from': moment(this.startDate).toISOString(),
      'date_to': moment(this.endDate).toISOString(),
      'base_price': this.price,
      'is_favorite': this.isFavorite
    };
  }

  static clone(data) {
    return new EventModel(data.toRaw());
  }

  static parseEvent(data) {
    return new EventModel(data);
  }

  static parseEvents(data) {
    return data.map(EventModel.parseEvent);
  }
}
