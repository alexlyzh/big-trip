import {getRandomInteger, getRandomUniqueIntegerList} from '../utils.js';
import {OffersPriceList} from '../constants.js';

const getFullOffersPricelistByType = (eventType) => {
  if (eventType in OffersPriceList) {
    return Object.entries(OffersPriceList[eventType]).map((offer) => ({
      title: offer[0],
      price: offer[1],
    }));
  }
};

const getRandomOffersPricelistByType = (type) => {
  const offers = getFullOffersPricelistByType(type);
  if (!offers) {
    return;
  }
  const randomIntegerList = getRandomUniqueIntegerList(0, offers.length - 1, getRandomInteger(0, offers.length - 1));

  if (randomIntegerList.length) {
    return randomIntegerList.map((integer) => offers[integer]);
  }
};

const generateOffer = (type) => ({
  type,
  offers: getFullOffersPricelistByType(type),
});

export {getFullOffersPricelistByType, getRandomOffersPricelistByType, generateOffer};
