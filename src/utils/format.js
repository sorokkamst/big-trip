import moment from 'moment';

const addLeadZero = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatFullDate = (timestamp) => moment(timestamp).format(`YYYY-MM-DD`);

export const formatDate = (timestamp) => moment(timestamp).format(`DD/MM/YY`);

export const formatTime = (timestamp) => moment(timestamp).format(`HH:mm`);

export const formatDateTime = (timestamp) => moment(timestamp).format();

export const formatMonth = (timestamp) => moment(timestamp).format(`MMM`);

export const formatDay = (timestamp) => moment(timestamp).format(`DD`);

export const formatDuration = (timestamp) => {
  const duration = moment.duration(timestamp);
  const days = duration.days() ? addLeadZero(duration.days()) + `D` : ``;
  const hours = duration.hours() ? addLeadZero(duration.hours()) + `H` : ``;
  const minutes = addLeadZero(duration.minutes()) + `M`;

  return `${days} ${hours} ${minutes}`;
};
