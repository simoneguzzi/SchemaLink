import { Size } from '../model/Size';

const applicationLayout = (
  state = {
    windowSize: new Size(window.innerWidth, window.innerHeight),
    inspectorVisible: true,
    styleMode: 'theme',
    betaFeaturesEnabled: false,
    layers: [],
  },
  action
) => {
  switch (action.type) {
    case 'WINDOW_RESIZED':
      return {
        ...state,
        windowSize: new Size(action.width, action.height),
      };

    case 'TOGGLE_INSPECTOR':
      return {
        ...state,
        inspectorVisible: !state.inspectorVisible,
      };

    case 'STYLE_THEME':
      return {
        ...state,
        styleMode: 'theme',
      };

    case 'STYLE_CUSTOMIZE':
      return {
        ...state,
        styleMode: 'customize',
      };

    case 'SET_BETA_FEATURES_ENABLED':
      return {
        ...state,
        layers: [],
        betaFeaturesEnabled: action.enabled,
      };
    default:
      return state;
  }
};

export default applicationLayout;
