import { Node, Point, Vector } from '@neo4j-arrows/model';
import { Action } from 'redux';
import { NodePosition } from '../selectors';

export type MouseState = {
  dragType: string;
  corner?: { x: string; y: string };
  mousePosition?: Point;
  initialMousePosition?: Point;
  initialNodePositions?: NodePosition[];
  node?: Node;
  mouseToNodeVector?: Vector;
  mouseDownPosition?: Point;
  dragged?: boolean;
};

interface HandleAction extends Action<'MOUSE_DOWN_ON_HANDLE'> {
  corner: { x: string; y: string };
  canvasPosition: Point;
  nodePositions: NodePosition[];
}

interface NodeAction
  extends Action<'MOUSE_DOWN_ON_NODE' | 'MOUSE_DOWN_ON_NODE_RING'> {
  node: Node;
  graphPosition: Point;
  position: Point;
}

interface CanvasAction extends Action<'MOUSE_DOWN_ON_CANVAS'> {
  canvasPosition: Point;
  graphPosition: Point;
}

interface DragModeAction extends Action<'LOCK_HANDLE_DRAG_MODE'> {
  dragType: string;
}

interface NewMousePositionAction
  extends Action<'MOVE_NODES' | 'RING_DRAGGED' | 'SET_MARQUEE'> {
  newMousePosition: Point;
}

export type MouseAction =
  | Action<'END_DRAG'>
  | DragModeAction
  | HandleAction
  | NodeAction
  | NewMousePositionAction
  | CanvasAction;

const mouse = (
  state: MouseState = { dragType: 'NONE' },
  action: MouseAction
): MouseState => {
  switch (action.type) {
    case 'MOUSE_DOWN_ON_HANDLE': {
      return {
        dragType: 'HANDLE',
        corner: action.corner,
        mousePosition: action.canvasPosition,
        initialMousePosition: action.canvasPosition,
        initialNodePositions: action.nodePositions,
      };
    }

    case 'LOCK_HANDLE_DRAG_MODE': {
      return {
        ...state,
        dragType: action.dragType,
      };
    }

    case 'MOUSE_DOWN_ON_NODE': {
      const mouseToNodeVector = action.node.position.vectorFrom(
        action.graphPosition
      );
      return {
        dragType: 'NODE',
        node: action.node,
        mousePosition: action.position,
        mouseToNodeVector,
      };
    }

    case 'MOUSE_DOWN_ON_NODE_RING': {
      return {
        dragType: 'NODE_RING',
        node: action.node,
        mousePosition: action.position,
      };
    }

    case 'MOUSE_DOWN_ON_CANVAS': {
      return {
        dragType: 'CANVAS',
        dragged: false,
        mousePosition: action.canvasPosition,
        mouseDownPosition: action.graphPosition,
      };
    }

    case 'MOVE_NODES': {
      const currentPosition = action.newMousePosition || state.mousePosition;
      return {
        ...state,
        dragged: true,
        mousePosition: currentPosition,
      };
    }

    case 'RING_DRAGGED':
      return {
        ...state,
        dragged: true,
        mousePosition: action.newMousePosition,
      };

    case 'SET_MARQUEE':
      return {
        ...state,
        dragType: 'MARQUEE',
        dragged: true,
        mousePosition: action.newMousePosition,
      };

    case 'END_DRAG':
      return {
        dragType: 'NONE',
      };

    default:
      return state;
  }
};

export default mouse;
