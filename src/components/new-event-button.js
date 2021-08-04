import AbstractComponent from './abstract-component';

export default class NewEventButton extends AbstractComponent {
  getTemplate() {
    return `
      <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
        New event
      </button>
    `;
  }

  setButtonClickHandler(handler) {
    this.getElement()
      .addEventListener(`click`, handler);
  }
}
