import { combineReducers } from 'redux';
import dragToCreate, { DraggingState } from './dragToCreate';
import selectionMarquee, { Marquee } from './selectionMarquee';

export type GesturesState = {
  dragToCreate: DraggingState;
  selectionMarquee: Marquee | null;
};

const gestures = combineReducers({
  dragToCreate,
  selectionMarquee,
});

export default gestures;
