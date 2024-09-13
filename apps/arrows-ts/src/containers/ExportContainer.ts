import { connect } from 'react-redux';
import ExportModal from '../components/ExportModal';
import { hideExportDialog } from '../actions/applicationDialogs';
import { getPresentGraph } from '../selectors';
import { Dispatch } from 'redux';
import { ArrowsState } from '../reducers';

const mapStateToProps = (state: ArrowsState) => {
  return {
    graph: getPresentGraph(state),
    cachedImages: state.cachedImages,
    diagramName: state.diagramName,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onCancel: () => {
      dispatch(hideExportDialog());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExportModal);
