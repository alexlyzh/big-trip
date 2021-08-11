import dayjs from 'dayjs';
import {getRandomInteger, isEsc} from './common.js';
import {EVENT_TYPES, MILLISECONDS_IN_DAY, MILLISECONDS_IN_HOUR, MILLISECONDS_IN_MINUTE, UNIX_START_DAY} from '../constants.js';
import PointView from '../view/point.js';
import EditFormView from '../view/edit-event-form.js';
import {render, replace, RenderPosition} from './render.js';

const getRandomEventType = () => EVENT_TYPES[getRandomInteger(0, EVENT_TYPES.length - 1)];
const formatToFullDateAndTime = (date) => dayjs(date).format('YYYY-MM-DD[T]HH:mm');
const formatToFullDate = (date) => dayjs(date).format('YYYY-MM-DD');
const formatToMonthAndDay = (date) => dayjs(date).format('MMM DD');
const formatToHoursAndMin = (date) => dayjs(date).format('HH:mm');
const formatToEditEventFormDatetime = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const getDuration = (from, to) => {
  let duration = dayjs(to).diff(dayjs(from), 'millisecond');
  let formatString;

  switch (true) {
    case duration >= MILLISECONDS_IN_DAY:
      formatString = 'DD[D] HH[H] mm[M]';
      break;
    case duration >= MILLISECONDS_IN_HOUR:
      formatString = 'HH[H] mm[M]';
      break;
    default:
      formatString = 'mm[M]';
  }
  duration = duration + new Date(duration).getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
  return dayjs(duration).subtract(UNIX_START_DAY, 'day').format(formatString);
};

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const renderPoint = (container, point) => {
  const pointComponent = new PointView(point);
  const editFormComponent = new EditFormView(point);

  const replacePointToForm = () => replace(editFormComponent, pointComponent);
  const replaceFormToPoint = () => replace(pointComponent, editFormComponent);

  const onDocumentEscKeydown = (evt) => {
    if (isEsc(evt)) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onDocumentEscKeydown);
    }
  };

  const closeEditForm = () => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onDocumentEscKeydown);
  };

  pointComponent.setRollupBtnClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onDocumentEscKeydown);
  });

  editFormComponent.setFormSubmitHandler((evt) => {
    evt.preventDefault();
    closeEditForm();
  });

  editFormComponent.setResetBtnClickHandler(() => {
    closeEditForm();
  });

  render(container, pointComponent, RenderPosition.BEFOREEND);
};

export {capitalize, getDuration, formatToEditEventFormDatetime, formatToHoursAndMin, formatToMonthAndDay, formatToFullDate, formatToFullDateAndTime, getRandomEventType, renderPoint};
