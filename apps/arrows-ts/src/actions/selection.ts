import { Dispatch } from 'redux';
import { getPresentGraph } from '../selectors';
import {
  Entity,
  Node,
  nodeSelected,
  selectedNodeIds,
} from '@neo4j-arrows/model';
import { ArrowsState } from '../reducers';
import { KeyBinding } from '../interactions/Keybindings';

type Direction = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';

export const activateEditing = (entity: Entity) => ({
  type: 'ACTIVATE_EDITING',
  editing: entity,
});

export const tryActivateEditing = () => {
  return function (dispatch: Dispatch, getState: () => ArrowsState) {
    const selection = getState().selection;
    if (selection.editing === undefined && selection.entities.length > 0) {
      dispatch(
        activateEditing(selection.entities[selection.entities.length - 1])
      );
    }
  };
};

export const deactivateEditing = () => ({
  type: 'DEACTIVATE_EDITING',
});

export const toggleSelection = (
  entities: Pick<Entity, 'id' | 'entityType'>[],
  mode: string
) => ({
  type: 'TOGGLE_SELECTION',
  entities: entities.map((entity) => ({
    entityType: entity.entityType,
    id: entity.id,
  })),
  mode,
});

export const selectAll = () => {
  return function (dispatch: Dispatch, getState: () => ArrowsState) {
    const graph = getPresentGraph(getState());
    dispatch(
      toggleSelection(
        [
          ...graph.nodes.map((node) => ({
            id: node.id,
            entityType: 'node',
            properties: node.properties,
            style: node.style,
          })),
          ...graph.relationships.map((relationship) => ({
            id: relationship.id,
            entityType: 'relationship',
            properties: relationship.properties,
            style: relationship.style,
          })),
        ],
        'replace'
      )
    );
  };
};

export const clearSelection = () => ({
  type: 'CLEAR_SELECTION',
});

export const jumpToNextNode = (direction: Direction, extraKeys: KeyBinding) => {
  return function (dispatch: Dispatch, getState: () => ArrowsState) {
    const state = getState();
    const graph = getPresentGraph(state);

    const currentSelection = getState().selection;
    const nodeIds = selectedNodeIds(currentSelection);
    const currentNodeId = nodeIds[nodeIds.length - 1];

    if (currentNodeId) {
      const currentNode = graph.nodes.find(
        (node) => node.id === currentNodeId
      ) as unknown as Node;
      const nextNode = getNextNode(currentNode, graph.nodes, direction);

      if (nextNode) {
        const multiSelect = extraKeys.shiftKey === true;
        if (multiSelect) {
          if (nodeSelected(currentSelection, nextNode.id)) {
            dispatch(
              toggleSelection([{ ...currentNode, entityType: 'node' }], 'xor')
            );
          } else {
            dispatch(
              toggleSelection([{ ...nextNode, entityType: 'node' }], 'or')
            );
          }
        } else {
          dispatch(
            toggleSelection([{ ...nextNode, entityType: 'node' }], 'replace')
          );
        }
      }
    }
  };
};

const getNextNode = (node: Node, nodes: Node[], direction: Direction) => {
  const angles = {
    LEFT: -Math.PI,
    UP: -Math.PI / 2,
    RIGHT: 0,
    DOWN: Math.PI / 2,
  };
  const idealAngle = angles[direction];
  return nodes
    .filter((candidateNode) => candidateNode.id !== node.id)
    .map((candidateNode) => ({
      node: candidateNode,
      vector: candidateNode.position.vectorFrom(node.position),
    }))
    .filter((candidate) => {
      const angle = candidate.vector.angle();
      return (
        (angle > idealAngle - Math.PI / 4 &&
          angle < idealAngle + Math.PI / 4) ||
        (angle > idealAngle + (Math.PI * 7) / 4 &&
          angle < idealAngle + (Math.PI * 9) / 4)
      );
    })
    .sort((a, b) => a.vector.distance() - b.vector.distance())
    .map((candidate) => candidate.node)[0];
};
