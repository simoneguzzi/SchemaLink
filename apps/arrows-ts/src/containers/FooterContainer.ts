import { connect } from 'react-redux';
import { showHelpDialog } from '../actions/applicationDialogs';
import Footer from '../components/Footer';
import { Dispatch } from 'redux';

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onHelpClick: () => {
      dispatch(showHelpDialog());
    },
  };
};

const FooterContainer = connect(mapStateToProps, mapDispatchToProps)(Footer);

export default FooterContainer;
