import { Guides } from '@neo4j-arrows/model';
import { Action } from 'redux';

interface GuidesActionWithGuides extends Action<'MOVE_NODES' | 'RING_DRAGGED'> {
  guides: Guides;
}

type GuidesAction = Action<'END_DRAG'> | GuidesActionWithGuides;

export default function guides(
  state = new Guides(),
  action: GuidesAction
): Guides {
  switch (action.type) {
    case 'MOVE_NODES':
    case 'RING_DRAGGED':
      return action.guides;

    case 'END_DRAG':
      return new Guides();

    default:
      return state;
  }
}
