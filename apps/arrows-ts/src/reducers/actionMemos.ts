import { Action } from 'redux';

export type ActionMemosState = {
  lastDuplicateAction?: Action;
};

export default function actionMemos(
  state: ActionMemosState = {},
  action: Action
): ActionMemosState {
  switch (action.type) {
    case 'DUPLICATE_NODES_AND_RELATIONSHIPS':
      return {
        ...state,
        lastDuplicateAction: action,
      };

    default:
      return state;
  }
}
