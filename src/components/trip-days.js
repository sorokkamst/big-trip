import AbstractComponent from './abstract-component';

export default class TripDays extends AbstractComponent {
  getTemplate() {
    return `
      <ul class="trip-days"></ul>
    `;
  }
}
