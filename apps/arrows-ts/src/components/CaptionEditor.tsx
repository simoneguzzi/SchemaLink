import React, { ChangeEvent, Component } from 'react';
import {
  NodeCaptionInsideNode,
  NodeCaptionFillNode,
  NodeCaptionOutsideNode,
  VisualNode,
  cssAlignFromSvgAlign,
} from '@neo4j-arrows/graphics';

interface CaptionEditorProps {
  component:
    | NodeCaptionInsideNode
    | NodeCaptionOutsideNode
    | NodeCaptionFillNode;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSetNodeCaption: (caption: string) => void;
  visualNode: VisualNode;
}

interface CaptionEditorState {
  selectionStart?: number;
}

export class CaptionEditor extends Component<
  CaptionEditorProps,
  CaptionEditorState
> {
  constructor(props: CaptionEditorProps) {
    super(props);
    this.state = {};
    this.textArea = React.createRef();
  }

  textArea: React.RefObject<HTMLTextAreaElement>;

  componentDidMount() {
    const textArea = this.textArea.current;
    textArea?.select();
  }

  shouldComponentUpdate(nextProps: CaptionEditorProps) {
    return nextProps.visualNode !== this.props.visualNode;
  }

  componentDidUpdate() {
    const textArea = this.textArea.current;
    if (
      textArea &&
      document.activeElement === textArea &&
      this.state.selectionStart
    ) {
      textArea.selectionStart = this.state.selectionStart;
      textArea.selectionEnd = this.state.selectionStart;
    }
  }

  handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const normalise = (text: string) => text.replace(/\s+/g, ' ');
    const selectionStart = normalise(
      e.target.value.substring(0, e.target.selectionStart)
    ).length;
    const caption = normalise(e.target.value);
    this.setState({ selectionStart });
    this.props.onSetNodeCaption(caption);
  };

  render() {
    const caption = this.props.component;
    const boundingBox = caption.boundingBox();
    const textLines = caption.layout.lines;
    const padding = 10;
    const horizontal = caption.orientation.horizontal;
    return (
      <textarea
        ref={this.textArea}
        value={textLines.join('\n')}
        onKeyDown={this.props.onKeyDown}
        onChange={this.handleChange}
        style={{
          position: 'absolute',
          padding: 0,
          left: boundingBox.left - (horizontal === 'start' ? 0 : padding),
          top: boundingBox.top,
          width:
            boundingBox.width +
            padding +
            (horizontal === 'center' ? padding : 0),
          height: boundingBox.height + padding,
          resize: 'none',
          outline: 'none',
          border: 'none',
          background: 'transparent',
          textAlign: cssAlignFromSvgAlign(horizontal),
          ...caption.font,
          lineHeight: 1.2,
        }}
      ></textarea>
    );
  }
}
