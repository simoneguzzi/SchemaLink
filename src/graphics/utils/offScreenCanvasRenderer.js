import {ViewTransformation} from "../../state/ViewTransformation";
import {getVisualGraph} from "../../selectors/index";
import {Vector} from "../../model/Vector";
import CanvasAdaptor from "./CanvasAdaptor";

export const renderPngAtScaleFactor = (graph, scaleFactor, transparentBackground) => {
  const renderState = {
    graph,
    selection: {
      entities: []
    }
  }
  const visualGraph = getVisualGraph(renderState)
  const boundingBox = visualGraph.boundingBox() || {
      left: 0, top: 0, right: 100, bottom: 100
    }

  const canvas = window.document.createElement('canvas')
  const width = Math.ceil(scaleFactor * boundingBox.width);
  const height = Math.ceil(scaleFactor * boundingBox.height);
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!transparentBackground) {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)
  }
  visualGraph.draw(new CanvasAdaptor(ctx), {
    viewTransformation: new ViewTransformation(scaleFactor,
      new Vector(-scaleFactor * boundingBox.left, -scaleFactor * boundingBox.top))
  })
  return {
    width,
    height,
    dataUrl: canvas.toDataURL()
  }
}