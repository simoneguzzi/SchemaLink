import { getVisualGraph, getTransformationHandles, getPositionsOfSelectedNodes } from "../selectors/"
import { clearSelection, toggleSelection } from "./selection"
import { showInspector } from "./applicationLayout";
import {
  connectNodes,
  createNodeAndRelationship,
  moveNodesEndDrag,
  tryMoveNode,
  tryMoveHandle
} from "./graph"
import {adjustViewport, pan, scroll} from "./viewTransformation"
import {activateRing, deactivateRing, tryDragRing} from "./dragToCreate"
import {selectItemsInMarquee, setMarquee} from "./selectionMarquee"
import { getEventHandlers } from "../selectors/layers";

const toGraphPosition = (state, canvasPosition) => state.viewTransformation.inverse(canvasPosition)

export const wheel = (canvasPosition, vector, ctrlKey) => {
  return function (dispatch, getState) {
    const state = getState()
    if (ctrlKey) {
      const graphPosition = toGraphPosition(state, canvasPosition)
      const scale = Math.max(state.viewTransformation.scale * (100 - vector.dy) / 100, 0.01)
      const offset = canvasPosition.vectorFrom(graphPosition.scale(scale))
      dispatch(adjustViewport(scale, offset.dx, offset.dy))
    } else {
      dispatch(scroll(vector.scale(state.viewTransformation.scale).invert()))
    }
  }
}

export const doubleClick = (canvasPosition) => {
  return function (dispatch, getState) {
    const state = getState()
    const visualGraph = getVisualGraph(state)
    const graphPosition = toGraphPosition(state, canvasPosition)
    const item = visualGraph.entityAtPoint(graphPosition)
    if (item) {
      dispatch(showInspector())
    }
  }
}

export const mouseDown = (canvasPosition, metaKey) => {
  return function (dispatch, getState) {
    const state = getState();
    const visualGraph = getVisualGraph(state)
    const transformationHandles = getTransformationHandles(state)
    const graphPosition = toGraphPosition(state, canvasPosition)

    const handle = transformationHandles.handleAtPoint(canvasPosition)
    if (handle) {
      dispatch(mouseDownOnHandle(handle.corner, canvasPosition, getPositionsOfSelectedNodes(state)))
    } else {
      const item = visualGraph.entityAtPoint(graphPosition)
      if (item) {
        switch (item.entityType) {
          case 'node':
            dispatch(toggleSelection([item], metaKey ? 'xor' : 'at-least'))
            dispatch(mouseDownOnNode(item, canvasPosition, graphPosition))
            break

          case 'relationship':
            dispatch(toggleSelection([item], metaKey ? 'xor' : 'at-least'))
            break

          case 'nodeRing':
            dispatch(mouseDownOnNodeRing(item, canvasPosition))
            break
        }
      } else {
        if (!metaKey) {
          dispatch(clearSelection())
        }
        dispatch(mouseDownOnCanvas(canvasPosition, graphPosition))
      }
    }
  }
}

const mouseDownOnHandle = (corner, canvasPosition, nodePositions) => ({
  type: 'MOUSE_DOWN_ON_HANDLE',
  corner,
  canvasPosition,
  nodePositions
})

const mouseDownOnNode = (node, canvasPosition, graphPosition) => ({
  type: 'MOUSE_DOWN_ON_NODE',
  node,
  position: canvasPosition,
  graphPosition
})

const mouseDownOnNodeRing = (node, canvasPosition) => ({
  type: 'MOUSE_DOWN_ON_NODE_RING',
  node,
  position: canvasPosition
})

const mouseDownOnCanvas = (canvasPosition, graphPosition) => ({
  type: 'MOUSE_DOWN_ON_CANVAS',
  canvasPosition,
  graphPosition
})

const furtherThanDragThreshold = (previousPosition, newPosition) => {
  const movementDelta = newPosition.vectorFrom(previousPosition)
  return movementDelta.distance() >= 3
}

export const mouseMove = (canvasPosition) => {
  return function (dispatch, getState) {
    const state = getState();
    const visualGraph = getVisualGraph(state)
    const graphPosition = toGraphPosition(state, canvasPosition)
    const dragging = state.gestures.dragToCreate
    const mouse = state.mouse
    const previousPosition = mouse.mousePosition

    const eventHandlers = getEventHandlers(state, 'mouseMove')
    const preventDefault = eventHandlers.reduce((prevented, handler) => handler({
      mouse,
      dispatch
    }) || prevented, false)

    if (!preventDefault) {
      switch (mouse.dragType) {
        case 'NONE':
          const item = visualGraph.entityAtPoint(graphPosition)
          if (item && item.entityType === 'nodeRing') {
            if (dragging.sourceNodeId === null || (dragging.sourceNodeId && item.id !== dragging.sourceNodeId)) {
              dispatch(activateRing(item.id, item.type))
            }
          } else {
            if (dragging.sourceNodeId !== null) {
              dispatch(deactivateRing())
            }
          }
          break

        case 'HANDLE':
          if (mouse.dragged || furtherThanDragThreshold(previousPosition, canvasPosition)) {
            dispatch(tryMoveHandle({
              corner: mouse.corner,
              initialNodePositions: mouse.initialNodePositions,
              initialMousePosition: mouse.initialMousePosition,
              newMousePosition: canvasPosition
            }))
          }
          break

        case 'NODE':
          if (mouse.dragged || furtherThanDragThreshold(previousPosition, canvasPosition)) {
            dispatch(tryMoveNode({
              nodeId: mouse.node.id,
              oldMousePosition: previousPosition,
              newMousePosition: canvasPosition
            }))
          }
          break

        case 'NODE_RING':
          dispatch(tryDragRing(mouse.node.id, graphPosition))
          break

        case 'CANVAS':
        case 'MARQUEE':
          dispatch(setMarquee(mouse.mouseDownPosition, graphPosition))
          break
      }
    }
  }
}

export const mouseUp = () => {
  return function (dispatch, getState) {
    const state = getState();
    const mouse = state.mouse

    const eventHandlers = getEventHandlers(state, 'mouseUp')
    const preventDefault = eventHandlers.reduce((prevented, handler) => handler({
      state,
      dispatch
    }) || prevented, false)

    if (!preventDefault) {
      switch (mouse.dragType) {
        case 'MARQUEE':
          dispatch(selectItemsInMarquee())
          break
        case 'HANDLE':
          dispatch(moveNodesEndDrag(getPositionsOfSelectedNodes(state)))
          break
        case 'NODE':
          dispatch(moveNodesEndDrag(getPositionsOfSelectedNodes(state)))
          break
        case 'NODE_RING':
          const dragToCreate = state.gestures.dragToCreate;

          if (dragToCreate.sourceNodeId) {
            if (dragToCreate.targetNodeId) {
              dispatch(connectNodes(dragToCreate.sourceNodeId, dragToCreate.targetNodeId))
            } else if (dragToCreate.newNodePosition) {
              dispatch(createNodeAndRelationship(dragToCreate.sourceNodeId, dragToCreate.newNodePosition))
            }
          }
          break
      }
    }

    dispatch(endDrag())
  }
}

export const endDrag = () => {
  return {
    type: 'END_DRAG'
  }
}


