import snapToTargetNode from './snapToTargetNode';
import { snapToDistancesAndAngles } from './geometricSnapping';
import { getVisualGraph } from '../selectors';
import {
  idsMatch,
  Guides,
  selectedNodeIds,
  Id,
  Point,
  Node,
} from '@neo4j-arrows/model';
import { Dispatch } from 'redux';
import { ArrowsState } from '../reducers';

export const activateRing = (sourceNodeId: Id) => {
  return {
    type: 'ACTIVATE_RING',
    sourceNodeId,
  };
};

export const deactivateRing = () => {
  return {
    type: 'DEACTIVATE_RING',
  };
};

export const tryDragRing = (sourceNodeId: Id, mousePosition: Point) => {
  return function (dispatch: Dispatch, getState: () => ArrowsState) {
    const state = getState();
    const selection = state.selection;
    const selected = selectedNodeIds(selection);
    const secondarySourceNodeIds = selected.includes(sourceNodeId)
      ? selected.filter((nodeId) => nodeId !== sourceNodeId)
      : [];

    const visualGraph = getVisualGraph(state);
    const newNodeRadius = visualGraph.graph.style.radius;
    const graph = visualGraph.graph;
    const sourceNode = graph.nodes.find((node) =>
      idsMatch(node.id, sourceNodeId)
    ) as unknown as Node;
    const primarySnap = snapToTargetNode(visualGraph, null, mousePosition);
    if (primarySnap.snapped) {
      const secondarySnaps = secondarySourceNodeIds.map(
        (secondarySourceNodeId) => {
          const secondarySourceNode = graph.nodes.find((node) =>
            idsMatch(node.id, secondarySourceNodeId)
          ) as unknown as Node;
          const displacement = secondarySourceNode.position.vectorFrom(
            sourceNode.position
          );
          return snapToTargetNode(
            visualGraph,
            null,
            mousePosition.translate(displacement)
          );
        }
      );
      const targetNodeIds = [
        primarySnap.snappedNodeId,
        ...(secondarySnaps.every((snap) => snap.snapped)
          ? secondarySnaps.map((snap) => snap.snappedNodeId)
          : secondarySnaps.map(() => primarySnap.snappedNodeId)),
      ];
      dispatch(
        ringDraggedConnected(
          sourceNodeId,
          secondarySourceNodeIds,
          targetNodeIds,
          primarySnap.snappedPosition,
          mousePosition
        )
      );
    } else {
      const snap = snapToDistancesAndAngles(
        graph,
        [sourceNode],
        () => true,
        mousePosition
      );
      if (snap.snapped) {
        dispatch(
          ringDraggedDisconnected(
            sourceNodeId,
            secondarySourceNodeIds,
            snap.snappedPosition,
            new Guides(snap.guidelines, mousePosition, newNodeRadius),
            mousePosition
          )
        );
      } else {
        dispatch(
          ringDraggedDisconnected(
            sourceNodeId,
            secondarySourceNodeIds,
            mousePosition,
            new Guides(),
            mousePosition
          )
        );
      }
    }
  };
};

const ringDraggedDisconnected = (
  sourceNodeId: Id,
  secondarySourceNodeIds: Id[],
  position: Point,
  guides: Guides,
  newMousePosition: Point
) => {
  return {
    type: 'RING_DRAGGED',
    sourceNodeId,
    secondarySourceNodeIds,
    targetNodeIds: [],
    position,
    guides,
    newMousePosition,
  };
};

const ringDraggedConnected = (
  sourceNodeId: Id,
  secondarySourceNodeIds: Id[],
  targetNodeIds: Id[],
  position: Point,
  newMousePosition: Point
) => {
  return {
    type: 'RING_DRAGGED',
    sourceNodeId,
    secondarySourceNodeIds,
    targetNodeIds,
    position,
    guides: new Guides(),
    newMousePosition,
  };
};
