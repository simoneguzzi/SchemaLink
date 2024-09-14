import { VisualGraph } from '@neo4j-arrows/graphics';
import { Id, Point, idsMatch } from '@neo4j-arrows/model';

const snapToTargetNode = (
  visualGraph: VisualGraph,
  excludedNodeId: Id,
  naturalPosition: Point
) => {
  const targetNode = visualGraph.closestNode(
    naturalPosition,
    (visualNode, distance) => {
      return (
        !idsMatch(visualNode.id, excludedNodeId) && distance < visualNode.radius
      );
    }
  );

  return {
    snapped: targetNode !== null,
    snappedNodeId: targetNode ? targetNode.id : null,
    snappedPosition: targetNode ? targetNode.position : null,
  };
};

export default snapToTargetNode;
