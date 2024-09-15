import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import {
  EntitySelection,
  Graph,
  selectedNodeIds,
  selectedRelationshipIds,
  selectedRelationships,
} from '@neo4j-arrows/model';

interface DetailToolboxProps {
  graph: Graph;
  onDelete: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onInlineRelationships: (selection: EntitySelection) => void;
  onMergeNodes: (selection: EntitySelection) => void;
  onReverseRelationships: (selection: EntitySelection) => void;
  selection: EntitySelection;
}

export const DetailToolbox = (props: DetailToolboxProps) => {
  const relationshipToolboxItems = (
    <Button
      floated="right"
      size="small"
      icon="exchange"
      content="Reverse"
      onClick={() => props.onReverseRelationships(props.selection)}
    />
  );

  const mergeNodesButton = (
    <Button
      floated="right"
      size="small"
      icon="crosshairs"
      content="Merge"
      onClick={() => props.onMergeNodes(props.selection)}
    />
  );

  const inlineRelationshipButton = (
    <Button
      floated="right"
      size="small"
      icon="columns"
      content="Inline"
      onClick={() => props.onInlineRelationships(props.selection)}
    />
  );

  const selectionToolboxItems = [
    <Button
      floated="right"
      size="small"
      icon="trash alternate outline"
      content="Delete"
      onClick={props.onDelete}
    />,
    <Button
      floated="right"
      size="small"
      icon="clone outline"
      content="Duplicate"
      onClick={props.onDuplicate}
    />,
  ];

  const someRelationshipsSelected =
    selectedRelationshipIds(props.selection).length > 0;
  const showMergeNodesButton = shouldShowMergeNodesButton(props.selection);
  const showInlineRelationshipsButton = shouldShowInlineRelationshipsButton(
    props.graph,
    props.selection
  );

  return (
    <Form.Field>
      {selectionToolboxItems}
      {someRelationshipsSelected ? relationshipToolboxItems : null}
      {showMergeNodesButton ? mergeNodesButton : null}
      {showInlineRelationshipsButton ? inlineRelationshipButton : null}
    </Form.Field>
  );
};

const shouldShowMergeNodesButton = (selection: EntitySelection) => {
  return (
    selectedNodeIds(selection).length > 1 &&
    selectedRelationshipIds(selection).length === 0
  );
};

const shouldShowInlineRelationshipsButton = (
  graph: Graph,
  selection: EntitySelection
) => {
  // only relationships selected
  if (
    selectedRelationshipIds(selection).length < 1 ||
    selectedNodeIds(selection).length > 0
  ) {
    return false;
  }

  // disjoint source and target node sets
  const sourceNodeIds = new Set();
  const targetNodeIds = new Set();
  for (const relationship of selectedRelationships(graph, selection)) {
    sourceNodeIds.add(relationship.fromId);
    targetNodeIds.add(relationship.toId);
  }
  const intersection = new Set(
    [...sourceNodeIds].filter((x) => targetNodeIds.has(x))
  );
  if (intersection.size > 0) {
    return false;
  }

  // all target nodes have properties
  for (const targetNodeId of targetNodeIds) {
    const targetNode = graph.nodes.find((node) => node.id === targetNodeId);
    if (!targetNode || (Object.entries(targetNode.properties).length === 0)) {
      return false;
    }
  }

  return true;
};
