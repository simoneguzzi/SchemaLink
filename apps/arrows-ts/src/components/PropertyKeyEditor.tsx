import { FontStyle } from '@neo4j-arrows/graphics';
import React, { ChangeEvent, Component } from 'react';

interface PropertyKeyEditorProps {
  font: FontStyle;
  left: number;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onSetPropertyKey: (key: string) => void;
  text: string;
  top: number;
  width: number;
}

export class PropertyKeyEditor extends Component<PropertyKeyEditorProps> {
  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.props.onSetPropertyKey(e.target.value);
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
          left: this.props.left - padding,
          top: this.props.top,
          width: this.props.width + padding,
          height: this.props.font.fontSize * 1.2,
          outline: 'none',
          border: 'none',
          background: 'transparent',
          textAlign: 'right',
          ...this.props.font,
          lineHeight: 1.2,
        }}
      ></input>
    );
  }
}
