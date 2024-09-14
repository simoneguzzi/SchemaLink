import { toggleSelection } from './selection';
import { BoundingBox } from '@neo4j-arrows/graphics';
import { getVisualGraph } from '../selectors/index';
import { Dispatch } from 'redux';
import { ArrowsState } from '../reducers';
import { Point } from '@neo4j-arrows/model';
import { Marquee } from '../reducers/selectionMarquee';

export const setMarquee = (from: Point, to: Point) => ({
  type: 'SET_MARQUEE',
  marquee: { from, to },
  newMousePosition: to,
});

export const selectItemsInMarquee = () => {
  return function (dispatch: Dispatch, getState: () => ArrowsState) {
    const state = getState();
    const marquee = state.gestures.selectionMarquee;
    if (marquee) {
      const visualGraph = getVisualGraph(state);
      const boundingBox = getBBoxFromCorners(marquee);
      const entities = visualGraph.entitiesInBoundingBox(boundingBox);
      if (entities.length > 0) {
        dispatch(toggleSelection(entities, 'or'));
      }
    }
  };
};

export const getBBoxFromCorners = ({ from, to }: Marquee) =>
  new BoundingBox(
    Math.min(from.x, to.x),
    Math.max(from.x, to.x),
    Math.min(from.y, to.y),
    Math.max(from.y, to.y)
  );
