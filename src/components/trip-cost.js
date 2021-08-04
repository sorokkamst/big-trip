import AbstractSmartComponent from './abstract-smart-component';

export default class TripCost extends AbstractSmartComponent {
  constructor() {
    super();

    this._total = 0;
  }

  getTemplate() {
    return `
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._total}</span>
      </p>
    `;
  }

  setValue(total) {
    this._total = total;

    super.rerender();
  }
}
