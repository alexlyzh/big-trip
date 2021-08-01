const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateAuthorizationID = () => `Basic ${Math.random().toString(36).substr(2, 11)}`;

export {getRandomInteger, generateAuthorizationID};
