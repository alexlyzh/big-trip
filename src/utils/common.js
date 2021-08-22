const getRandomInteger = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomUniqueIntegerList = (min = 0, max = 1, length) => {
  const list = [];
  while (list.length !== length) {
    const number = getRandomInteger(min, max);
    if (!list.includes(number)) {
      list.push(number);
    }
  }
  return list;
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [...items.splice(index, 1, update)];
};

const getTemplateFromItemsArray = (items = [], cb) => items.map((item) => cb(item)).join('');
const generateID = () => Math.random().toString(36).substr(2, 11);
const isEsc = (evt) => evt.keyCode === 27;

export {isEsc, getRandomUniqueIntegerList, getRandomInteger, generateID, getTemplateFromItemsArray, updateItem};
