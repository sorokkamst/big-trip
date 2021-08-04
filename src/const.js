import {nanoid} from 'nanoid';

const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v10`;
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export const AUTHORIZATION = `Basic ${nanoid()}`;
export const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

export const DEBOUNCE_TIMEOUT = 500;

export const HIDDEN_CLASS = `visually-hidden`;

export const RequestMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const EventType = {
  TRANSFERS: [
    `bus`,
    `drive`,
    `flight`,
    `ship`,
    `taxi`,
    `train`,
    `transport`
  ],
  ACTIVITIES: [
    `check-in`,
    `restaurant`,
    `sightseeing`
  ]
};

export const emojiMap = {
  'bus': `🚌`,
  'check-in': `🏨`,
  'drive': `🚗`,
  'flight': `✈️`,
  'restaurant': `🍽️`,
  'ship': `🚢`,
  'sightseeing': `🏛️`,
  'taxi': `🚕`,
  'train': `🚂`,
  'transport': `🚊`
};

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const SortType = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`
};

export const ChartTitle = {
  MONEY: `money`,
  TRANSPORT: `transport`,
  TIME_SPENT: `time spent`
};

export const emptyEvent = {
  type: `bus`,
  destination: {
    name: ``,
    description: ``,
    pictures: [{
      src: ``,
      description: ``
    }]
  },
  offers: [],
  startDate: Date.now(),
  endDate: Date.now(),
  price: 0,
  isFavorite: false
};

export const DefaultButtonText = {
  SAVE: `Save`,
  DELETE: `Delete`,
  CANCEL: `Cancel`
};

export const ActionButtonText = {
  SAVE: `Saving...`,
  DELETE: `Deleting...`
};
