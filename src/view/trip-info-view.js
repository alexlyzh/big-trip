import Abstract from './abstract.js';
import {formatToMonthAndDay} from '../utils/point.js';

const getTotalOffersPrice = (points) => points.reduce((totalOffersPrice, point) => {
  const {offers = []} = point;
  return totalOffersPrice + offers.reduce((pointOffersPrice, offer) => pointOffersPrice + offer.price, 0);
},0);

const getTotalBasePrice = (points) => points.reduce((total, point) => total + point.basePrice, 0);

const getTotalTripPrice = (points = []) => getTotalBasePrice(points) + getTotalOffersPrice(points);

const getTripInfoTitle = (points) => {
  switch (points.length) {
    case 1:
      return `${points[0].destination.name}`;
    case 2:
      return `${points[0].destination.name} &mdash; ${points[1].destination.name}`;
    case 3:
      return `${points[0].destination.name} &mdash; ${points[1].destination.name} &mdash; ${points[2].destination.name}`;
    default:
      return `${points[0].destination.name} &mdash; ... &mdash; ${points[points.length - 1].destination.name}`;
  }
};

const getTripInfoDates = (points) => {
  const tripStart = formatToMonthAndDay(points[0].dateFrom);
  const tripEnd = formatToMonthAndDay(points[points.length - 1].dateTo);
  return `${tripStart}&nbsp;&mdash;&nbsp;${tripEnd}`;
};

const createTripInfoTemplate = (points = []) => (
  !points.length ?
    `<section class="trip-main__trip-info trip-info visually-hidden">
      </section>` :
    `<section class="trip-main__trip-info trip-info">
       <div class="trip-info__main">
          <h1 class="trip-info__title">${getTripInfoTitle(points)}</h1>
          <p class="trip-info__dates">${getTripInfoDates(points)}</p>
       </div>
       <p class="trip-info__cost">
         Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalTripPrice(points)}</span>
       </p>
    </section>`
);

export default class TripInfoView extends Abstract {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }
}
