import {connect} from "react-redux"
import GraphDisplay from "../components/GraphDisplay"
import {compose} from "recompose"
import withKeyBindings from "../interactions/Keybindings"
import {windowResized} from "../actions/windowSize"
import {getVisualGraph} from "../selectors/index"
import {deleteSelection} from "../actions/graph"
import {removeSelectionPath} from "../actions/selectionPath"

const mapStateToProps = state => {
  return {
    visualGraph: getVisualGraph(state),
    selection: state.selection,
    gestures: state.gestures,
    guides: state.guides,
    canvasSize: state.windowSize,
    viewTransformation: state.viewTransformation
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onWindowResized: (width, height) => dispatch(windowResized(width, height)),
    removeSelectionPath: () => dispatch(removeSelectionPath()),
    deleteSelection: () => dispatch(deleteSelection()),
    dispatch: dispatch
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withKeyBindings
)(GraphDisplay)