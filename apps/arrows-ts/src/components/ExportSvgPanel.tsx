import React, { Component } from 'react';
import { Message, Icon } from 'semantic-ui-react';
import SvgExport from './SvgExport';
import { Graph } from '@neo4j-arrows/model';
import { ImageInfo } from '@neo4j-arrows/graphics';

interface ExportSvgPanelProps {
  graph: Graph;
  cachedImages: Record<string, ImageInfo>;
  diagramName: string;
}

class ExportSvgPanel extends Component<ExportSvgPanelProps> {
  render() {
    return (
      <React.Fragment>
        <Message info icon>
          <Icon name="info" />
          <div>
            <p>
              Try dragging the image below straight into your favourite vector
              image editor, for example Sketch. You will find that the graphics
              elements are fully editable.
            </p>
          </div>
        </Message>
        <SvgExport
          graph={this.props.graph}
          cachedImages={this.props.cachedImages}
          diagramName={this.props.diagramName}
        />
      </React.Fragment>
    );
  }
}

export default ExportSvgPanel;
