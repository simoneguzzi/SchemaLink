import { Vector, ViewTransformation } from '@neo4j-arrows/model';
import { Action } from 'redux';

interface ScrollAction extends Action<'SCROLL'> {
  vector: Vector;
}

interface AdjustViewportAction extends Action<'ADJUST_VIEWPORT'> {
  scale: number;
  panX: number;
  panY: number;
}

type ViewTransformationAction = ScrollAction | AdjustViewportAction;

const viewTransformation = (
  state = new ViewTransformation(),
  action: ViewTransformationAction
): ViewTransformation => {
  switch (action.type) {
    case 'SCROLL':
      return state.scroll(action.vector);

    case 'ADJUST_VIEWPORT':
      return state.adjust(action.scale, action.panX, action.panY);
    default:
      return state;
  }
};

export default viewTransformation;
