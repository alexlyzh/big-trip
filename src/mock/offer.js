import {OffersPriceList} from '../constants.js';

const getOffersForEventType = (eventType) => {
  if (eventType in OffersPriceList) {
    return Object.entries(OffersPriceList[eventType]).map((offer) => ({
      title: offer[0],
      price: offer[1],
    }));
  }
};

const generateOffer = (type) => ({
  type,
  offers: getOffersForEventType(type),
});

export {getOffersForEventType, generateOffer};
