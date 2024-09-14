import { Size } from '@neo4j-arrows/model';
import { Action } from 'redux';

export type ApplicationLayoutState = {
  windowSize: Size;
  inspectorVisible: boolean;
  styleMode: string;
  betaFeaturesEnabled: boolean;
  layers: any[];
};

interface SetBetaFeaturesEnabledAction
  extends Action<'SET_BETA_FEATURES_ENABLED'> {
  enabled: boolean;
}

interface WindowResizedAction extends Action<'WINDOW_RESIZED'> {
  width: number;
  height: number;
}

type ApplicationLayoutAction =
  | Action<'TOGGLE_INSPECTOR' | 'STYLE_THEME' | 'STYLE_CUSTOMIZE'>
  | WindowResizedAction
  | SetBetaFeaturesEnabledAction;

const applicationLayout = (
  state: ApplicationLayoutState = {
    windowSize: new Size(window.innerWidth, window.innerHeight),
    inspectorVisible: true,
    styleMode: 'theme',
    betaFeaturesEnabled: false,
    layers: [],
  },
  action: ApplicationLayoutAction
): ApplicationLayoutState => {
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
