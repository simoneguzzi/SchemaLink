import { Point } from '@neo4j-arrows/model';
import { Action } from 'redux';

export type Marquee = {
  from: Point;
  to: Point;
};

type MarqueeAction = Action<'SET_MARQUEE'> & {
  marquee: Marquee;
};

export default function selectionMarquee(
  state: Marquee | null = null,
  action: Action<'END_DRAG'> | MarqueeAction
): Marquee | null {
  switch (action.type) {
    case 'SET_MARQUEE':
      return action.marquee;
    case 'END_DRAG':
      return null;
    default:
      return state;
  }
}
