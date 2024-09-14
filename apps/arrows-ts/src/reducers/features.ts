import { Action } from 'redux';

export type FeaturesState = {
  'storage.GOOGLE_DRIVE': boolean;
  'storage.LOCAL_STORAGE': boolean;
  'storage.DATABASE': boolean;
};

const initialState = {
  'storage.GOOGLE_DRIVE': true,
  'storage.LOCAL_STORAGE': true,
  'storage.DATABASE': false,
};

export default (state = initialState, action: Action): FeaturesState =>
  initialState;
