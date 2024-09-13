import React, { Component } from 'react';
import { Message, Icon, Checkbox } from 'semantic-ui-react';
import PngExport from './PngExport';
import { Graph } from '@neo4j-arrows/model';
import { ImageInfo } from '@neo4j-arrows/graphics';

interface ExportPngPanelProps {
  graph: Graph;
  cachedImages: Record<string, ImageInfo>;
  diagramName: string;
}

interface ExportPngPanelState {
  transparentBackground: boolean;
}

class ExportPngPanel extends Component<
  ExportPngPanelProps,
  ExportPngPanelState
> {
  constructor(props: ExportPngPanelProps) {
    super(props);
    this.state = {
      transparentBackground: true,
    };
  }

  toggleTransparent = () => {
    this.setState({
      transparentBackground: !this.state.transparentBackground,
    });
  };

  render() {
    return (
      <React.Fragment>
        <Message info icon>
          <Icon name="info" />
          <div>
            <p>
              Below are a few PNGs at different "pixel ratios". Choose your
              preferred resolution and then get hold of the image by:
            </p>
            <ul>
              <li>
                Clicking on the "Download" link to download a file to your
                computer, or
              </li>
              <li>Right-clicking on the image and choosing "Copy Image", or</li>
              <li>
                Dragging the image to another browser tab or to another
                application.
              </li>
            </ul>
          </div>
        </Message>
        <Checkbox
          label="Transparent background"
          checked={this.state.transparentBackground}
          onChange={this.toggleTransparent}
        />

        {[1, 2, 4].map((pixelRatio) => (
          <PngExport
            key={pixelRatio}
            graph={this.props.graph}
            cachedImages={this.props.cachedImages}
            diagramName={this.props.diagramName}
            pixelRatio={pixelRatio}
            transparentBackground={this.state.transparentBackground}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default ExportPngPanel;
