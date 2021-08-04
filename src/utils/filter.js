import {FilterType} from '../const';

export const getEverythingEvents = (events) => {
  return events.slice().sort((a, b) => a.startDate - b.startDate);
};

export const getFutureEvents = (events) => {
  return events.filter((event) => event.startDate > Date.now());
};

export const getPastEvents = (events) => {
  return events.filter((event) => event.startDate < Date.now());
};

export const getEventsByFilter = (events, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return getEverythingEvents(events);
    case FilterType.FUTURE:
      return getFutureEvents(events);
    case FilterType.PAST:
      return getPastEvents(events);
  }

  return events;
};
