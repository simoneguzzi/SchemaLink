import React, { Component } from 'react';
import { PropertyKeyEditor } from './PropertyKeyEditor';
import { PropertyValueEditor } from './PropertyValueEditor';
import { VisualNode } from '@neo4j-arrows/graphics';
import { EntitySelection } from '@neo4j-arrows/model';

interface PropertiesEditorProps {
  selection: EntitySelection;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onSetPropertyKey: (
    selection: EntitySelection,
    oldKey: string,
    newKey: string
  ) => void;
  onSetPropertyValue: (
    selection: EntitySelection,
    key: string,
    value: string
  ) => void;
  visualNode: VisualNode;
}

export class PropertiesEditor extends Component<PropertiesEditorProps> {
  shouldComponentUpdate(nextProps: PropertiesEditorProps) {
    return nextProps.visualNode !== this.props.visualNode;
  }

  render() {
    const nodeProperties = this.props.visualNode.properties;
    const { selection, onSetPropertyKey, onSetPropertyValue } = this.props;
    return (
      nodeProperties &&
      nodeProperties.propertiesBox.properties.map((property, index) => {
        const boxPosition = nodeProperties.boxPosition;
        const propertiesBox = nodeProperties.propertiesBox;
        return [
          <PropertyKeyEditor
            key={'key-' + index}
            text={property.key}
            left={boxPosition?.x}
            top={boxPosition?.y + index * propertiesBox?.lineHeight}
            width={propertiesBox?.keysWidth}
            font={propertiesBox?.font}
            onSetPropertyKey={(key: string) =>
              onSetPropertyKey(selection, property.key, key)
            }
            onKeyDown={this.props.onKeyDown}
          />,
          <PropertyValueEditor
            key={'value-' + index}
            text={property.value}
            left={
              boxPosition.x +
              propertiesBox.keysWidth +
              propertiesBox.colonWidth +
              propertiesBox.spaceWidth
            }
            top={boxPosition?.y + index * propertiesBox?.lineHeight}
            width={propertiesBox?.valuesWidth}
            font={propertiesBox?.font}
            onSetPropertyValue={(value: string) =>
              onSetPropertyValue(selection, property.key, value)
            }
            onKeyDown={this.props.onKeyDown}
          />,
        ];
      })
    );
  }
}
