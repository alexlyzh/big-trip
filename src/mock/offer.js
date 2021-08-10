
import {OffersPriceList} from '../constants.js';
import {getRandomInteger, getRandomUniqueIntegerList} from '../utils/common';

const getFullOffersPricelistByType = (eventType) => {
  if (eventType in OffersPriceList) {
    return Object.entries(OffersPriceList[eventType]).map((offer) => (
      {
        title: offer[0],
        price: offer[1],
      }
    ));
  }
  return [];
};

const getRandomOffersPricelistByType = (type) => {
  const offers = getFullOffersPricelistByType(type);
  if (!offers.length) {
    return;
  }

  const randomIntegerList = getRandomUniqueIntegerList(0, offers.length - 1, getRandomInteger(0, offers.length - 1));
  if (randomIntegerList.length) {
    return randomIntegerList.map((integer) => offers[integer]);
  }
};

export {getFullOffersPricelistByType, getRandomOffersPricelistByType};
