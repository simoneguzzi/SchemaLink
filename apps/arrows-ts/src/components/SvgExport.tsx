import React, { Component } from 'react';
import { Image, Segment, Label, Icon } from 'semantic-ui-react';
import { ImageInfo, renderSvgEncapsulated } from '@neo4j-arrows/graphics';
import { Graph } from '@neo4j-arrows/model';

interface SvgExportProps {
  graph: Graph;
  cachedImages: Record<string, ImageInfo>;
  diagramName: string;
}

interface SvgExportState {
  width: number;
  height: number;
  dataUrl?: string;
}

class SvgExport extends Component<SvgExportProps, SvgExportState> {
  constructor(props: SvgExportProps) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    renderSvgEncapsulated(this.props.graph, this.props.cachedImages).then(
      (renderResult) => {
        this.setState(renderResult);
      }
    );
  }

  render() {
    if (this.state.dataUrl) {
      const { width, height, dataUrl } = this.state;

      return (
        <Segment
          style={{
            maxHeight: 200,
            overflow: 'hidden',
          }}
        >
          <Label attached="top">
            {width} × {height}
            <a href={dataUrl} download={this.props.diagramName + '.svg'}>
              <Icon name="download" />
              Download
            </a>
          </Label>
          <div
            style={{
              display: 'inline-block',
              backgroundImage:
                'linear-gradient(45deg, #efefef 25%, transparent 25%), ' +
                'linear-gradient(-45deg, #efefef 25%, transparent 25%), ' +
                'linear-gradient(45deg, transparent 75%, #efefef 75%), ' +
                'linear-gradient(-45deg, transparent 75%, #efefef 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          >
            <Image src={dataUrl} />
          </div>
        </Segment>
      );
    } else {
      return (
        <Segment
          style={{
            maxHeight: 200,
            overflow: 'hidden',
          }}
        >
          <Label attached="top">Rendering...</Label>
        </Segment>
      );
    }
  }
}

export default SvgExport;
