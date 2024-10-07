import React, { Component } from 'react';
import { PropertyKeyEditor } from './PropertyKeyEditor';
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
  visualNode: VisualNode;
}

export class PropertiesEditor extends Component<PropertiesEditorProps> {
  shouldComponentUpdate(nextProps: PropertiesEditorProps) {
    return nextProps.visualNode !== this.props.visualNode;
  }

  render() {
    const nodeProperties = this.props.visualNode.properties;
    const { selection, onSetPropertyKey } = this.props;
    return (
      nodeProperties &&
      nodeProperties.propertiesBox.properties.map((property, index) => {
        const boxPosition = nodeProperties.boxPosition;
        const propertiesBox = nodeProperties.propertiesBox;
        return [
          <PropertyKeyEditor
            key={'key-' + index}
            text={property}
            left={boxPosition?.x}
            top={boxPosition?.y + index * propertiesBox?.lineHeight}
            width={propertiesBox?.keysWidth}
            font={propertiesBox?.font}
            onSetPropertyKey={(key: string) =>
              onSetPropertyKey(selection, property, key)
            }
            onKeyDown={this.props.onKeyDown}
          />,
        ];
      })
    );
  }
}
