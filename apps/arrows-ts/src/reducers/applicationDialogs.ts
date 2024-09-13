import { Action } from 'redux';
import { retrieveHelpDismissed } from '../actions/localStorage';

export type ApplicationDialogsState = {
  showExportDialog: boolean;
  showSaveAsDialog: boolean;
  showImportDialog: boolean;
  showHelpDialog: boolean;
};

export default function applicationDialogs(
  state: ApplicationDialogsState = {
    showExportDialog: false,
    showSaveAsDialog: false,
    showImportDialog: false,
    showHelpDialog: !retrieveHelpDismissed(),
  },
  action: Action
): ApplicationDialogsState {
  switch (action.type) {
    case 'SHOW_EXPORT_DIALOG':
      return {
        ...state,
        showExportDialog: true,
      };

    case 'HIDE_EXPORT_DIALOG':
      return {
        ...state,
        showExportDialog: false,
      };

    case 'SHOW_SAVE_AS_DIALOG':
      return {
        ...state,
        showSaveAsDialog: true,
      };

    case 'HIDE_SAVE_AS_DIALOG':
      return {
        ...state,
        showSaveAsDialog: false,
      };

    case 'SHOW_IMPORT_DIALOG':
      return {
        ...state,
        showImportDialog: true,
      };

    case 'HIDE_IMPORT_DIALOG':
      return {
        ...state,
        showImportDialog: false,
      };

    case 'SHOW_HELP_DIALOG':
      return {
        ...state,
        showHelpDialog: true,
      };

    case 'HIDE_HELP_DIALOG':
      return {
        ...state,
        showHelpDialog: false,
      };

    default:
      return state;
  }
}
