import { DuplicateNodesAndRelationshipsAction } from './graph';

export type ActionMemosState = {
  lastDuplicateAction?: DuplicateNodesAndRelationshipsAction;
};

export default function actionMemos(
  state: ActionMemosState = {},
  action: DuplicateNodesAndRelationshipsAction
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
