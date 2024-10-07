import React, { Component } from 'react';
import { CaptionEditor } from './CaptionEditor';
import { RelationshipTypeEditor } from './RelationshipTypeEditor';
import { PropertiesEditor } from './PropertiesEditor';
import {
  Entity,
  EntitySelection,
  getStyleSelector,
  Vector,
  ViewTransformation,
} from '@neo4j-arrows/model';
import {
  ComponentStack,
  DrawableComponent,
  NodeCaptionFillNode,
  NodeCaptionInsideNode,
  NodeCaptionOutsideNode,
  RelationshipType,
  StackedComponent,
  VisualGraph,
  VisualNode,
  VisualRelationship,
} from '@neo4j-arrows/graphics';
import { measureTextContext } from '../selectors';
import { LabelsEditor } from './LabelsEditor';

const EditableComponentTypes = ['CAPTION', 'TYPE', 'LABELS', 'PROPERTIES'];

const editableComponentFilter = (component: StackedComponent) =>
  EditableComponentTypes.indexOf(component.component.type) !== -1;

interface GraphTextEditorsProps {
  onExit: () => void;
  onSetPropertyKey: (
    selection: EntitySelection,
    oldPropertyKey: string,
    newPropertyKey: string
  ) => void;
  onSetPropertyValue: (
    selection: EntitySelection,
    key: string,
    value: string
  ) => void;
  onSetNodeCaption: (selection: EntitySelection, caption: string) => void;
  onSetRelationshipType: (selection: EntitySelection, type: string) => void;
  selection: EntitySelection;
  viewTransformation: ViewTransformation;
  visualGraph: VisualGraph;
}

export class GraphTextEditors extends Component<GraphTextEditorsProps> {
  entityEditor(entity: Entity) {
    switch (entity.entityType) {
      case 'node': {
        const visualNode = this.props.visualGraph.nodes[entity.id];
        let insideComponents = visualNode.insideComponents;
        let outsideComponents = visualNode.outsideComponents;
        if (
          insideComponents.isEmpty(editableComponentFilter) &&
          outsideComponents.isEmpty(editableComponentFilter)
        ) {
          const style = (styleAttribute: string) =>
            getStyleSelector(
              visualNode.node,
              styleAttribute
            )(this.props.visualGraph.graph);
          const captionPosition = style('class-name-position');
          switch (captionPosition) {
            case 'inside': {
              const insideCaption = new NodeCaptionFillNode(
                '',
                visualNode.radius,
                true,
                style,
                measureTextContext
              );
              insideComponents = new ComponentStack();
              insideComponents.push(insideCaption);
              break;
            }
            default: {
              const outsideCaption = new NodeCaptionOutsideNode(
                '',
                visualNode.outsideOrientation,
                true,
                style,
                measureTextContext
              );
              outsideComponents = new ComponentStack();
              outsideComponents.push(outsideCaption);
              break;
            }
          }
        }
        return (
          <div
            style={{
              transform: visualNode.position
                .vectorFromOrigin()
                .asCSSTransform(),
            }}
          >
            {insideComponents.offsetComponents
              .filter(editableComponentFilter)
              .map((offsetComponent: StackedComponent) => (
                <div
                  key={offsetComponent.component.type}
                  style={{
                    transform: [
                      `scale(${visualNode.internalScaleFactor})`,
                      `translate(0, ${
                        visualNode.internalVerticalOffset + offsetComponent.top
                      }px)`,
                    ].join(' '),
                  }}
                >
                  {this.componentEditor(visualNode, offsetComponent.component)}
                </div>
              ))}
            {outsideComponents.offsetComponents
              .filter(editableComponentFilter)
              .map((offsetComponent: StackedComponent) => (
                <div
                  key={offsetComponent.component.type}
                  style={{
                    transform: visualNode.outsideOffset
                      .plus(new Vector(0, offsetComponent.top))
                      .asCSSTransform(),
                  }}
                >
                  {this.componentEditor(visualNode, offsetComponent.component)}
                </div>
              ))}
          </div>
        );
      }

      case 'relationship': {
        const visualRelationship = this.props.visualGraph.relationshipBundles
          .flatMap(({ routedRelationships }) => routedRelationships)
          .find((candidateRelationship) => candidateRelationship.id);
        if (visualRelationship) {
          let components = visualRelationship.components;
          if (components.isEmpty(editableComponentFilter)) {
            const style = (styleAttribute: string) =>
              getStyleSelector(
                visualRelationship.resolvedRelationship.relationship,
                styleAttribute
              )(this.props.visualGraph.graph);
            const type = new RelationshipType(
              '',
              { horizontal: 'center', vertical: 'center' },
              true,
              style,
              measureTextContext
            );
            components = new ComponentStack();
            components.push(type);
          }
          return components.offsetComponents.map((offsetComponent) => (
            <div
              key={offsetComponent.component.type}
              style={{
                transform: [
                  visualRelationship.arrow
                    .midPoint()
                    .vectorFromOrigin()
                    .asCSSTransform(),
                  `rotate(${visualRelationship.componentRotation}rad)`,
                  visualRelationship.componentOffset
                    .plus(new Vector(0, offsetComponent.top))
                    .asCSSTransform(),
                ].join(' '),
              }}
            >
              {this.componentEditor(
                visualRelationship,
                offsetComponent.component
              )}
            </div>
          ));
        }
        break;
      }
    }
    return null;
  }

  componentEditor(
    visualEntity: VisualNode | VisualRelationship,
    component: DrawableComponent
  ) {
    switch (component.type) {
      case 'CAPTION':
        return (
          visualEntity instanceof VisualNode &&
          (component instanceof NodeCaptionInsideNode ||
            component instanceof NodeCaptionOutsideNode ||
            component instanceof NodeCaptionFillNode) && (
            <CaptionEditor
              key={'caption-' + visualEntity.id}
              visualNode={visualEntity}
              component={component}
              onSetNodeCaption={(caption) =>
                this.props.onSetNodeCaption(this.props.selection, caption)
              }
              onKeyDown={this.handleKeyDown}
            />
          )
        );
      case 'TYPE':
        return (
          <RelationshipTypeEditor
            visualRelationship={visualEntity}
            component={component}
            onSetRelationshipType={(type: string) =>
              this.props.onSetRelationshipType(this.props.selection, type)
            }
            onKeyDown={this.handleKeyDown}
          />
        );
      case 'LABELS':
        return (
          <LabelsEditor
            key={'labels-' + visualEntity.id}
            visualNode={visualEntity}
          />
        );
      case 'PROPERTIES':
        return (
          <PropertiesEditor
            key={'properties-' + visualEntity.id}
            visualNode={visualEntity as VisualNode}
            selection={this.props.selection}
            onSetPropertyKey={this.props.onSetPropertyKey}
            onKeyDown={this.handleKeyDown}
          />
        );
    }
  }

  render() {
    const entity = this.props.selection.editing;
    if (entity) {
      return (
        <div
          style={{
            transform: this.props.viewTransformation.asCSSTransform(),
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        >
          {this.entityEditor(entity)}
        </div>
      );
    } else {
      return null;
    }
  }

  handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || (e.key === 'Enter' && e.metaKey)) {
      this.props.onExit();
    }
  };
}
