import { FontStyle } from '@neo4j-arrows/graphics';
import React, { ChangeEvent, Component } from 'react';

interface PropertyValueEditorProps {
  font: FontStyle;
  left: number;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onSetPropertyValue: (value: string) => void;
  text: string;
  top: number;
  width: number;
}

export class PropertyValueEditor extends Component<PropertyValueEditorProps> {
  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.props.onSetPropertyValue(e.target.value);
  };

  render() {
    const padding = 10;
    return (
      <input
        value={this.props.text}
        onKeyDown={this.props.onKeyDown}
        onChange={this.handleChange}
        style={{
          position: 'absolute',
          padding: 0,
          left: this.props.left,
          top: this.props.top,
          width: this.props.width + padding,
          height: this.props.font.fontSize * 1.2,
          outline: 'none',
          border: 'none',
          background: 'transparent',
          textAlign: 'left',
          ...this.props.font,
          lineHeight: 1.2,
        }}
      ></input>
    );
  }
}
