import { Id, Point } from '@neo4j-arrows/model';
import { Action } from 'redux';

export type DraggingState = {
  sourceNodeId: Id | null;
  secondarySourceNodeIds: Id[];
  targetNodeIds: Id[];
  newNodePosition: Point | null;
};

type DraggingAction = Action<
  'ACTIVATE_RING' | 'RING_DRAGGED' | 'DEACTIVATE_RING' | 'END_DRAG'
> & {
  sourceNodeId: Id;
  secondarySourceNodeIds: Id[];
  targetNodeIds: Id[];
  position: Point;
};

export default function dragging(
  state: DraggingState = {
    sourceNodeId: null,
    secondarySourceNodeIds: [],
    targetNodeIds: [],
    newNodePosition: null,
  },
  action: DraggingAction
): DraggingState {
  switch (action.type) {
    case 'ACTIVATE_RING':
      return {
        sourceNodeId: action.sourceNodeId,
        secondarySourceNodeIds: [],
        targetNodeIds: [],
        newNodePosition: null,
      };
    case 'RING_DRAGGED':
      return {
        sourceNodeId: action.sourceNodeId,
        secondarySourceNodeIds: action.secondarySourceNodeIds,
        targetNodeIds: action.targetNodeIds,
        newNodePosition: action.position,
      };
    case 'DEACTIVATE_RING':
    case 'END_DRAG':
      return {
        sourceNodeId: null,
        secondarySourceNodeIds: [],
        targetNodeIds: [],
        newNodePosition: null,
      };
    default:
      return state;
  }
}
