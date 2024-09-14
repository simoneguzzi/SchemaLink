import { combineReducers } from 'redux';
import recentStorage from './recentStorage';
import storage from './storage';
import diagramName from './diagramName';
import graph from './graph';
import selection from './selection';
import mouse from './mouse';
import guides from './guides';
import applicationLayout from './applicationLayout';
import viewTransformation from './viewTransformation';
import gestures from './gestures';
import actionMemos, { ActionMemosState } from './actionMemos';
import applicationDialogs, {
  ApplicationDialogsState,
} from './applicationDialogs';
import features from './features';
import googleDrive from './googleDrive';
import cachedImages from './cachedImages';
import ontologies, { OntologyState } from './ontologies';
import { ImageInfo } from '@neo4j-arrows/graphics';
import { Graph } from '@neo4j-arrows/model';
import { StateWithHistory } from 'redux-undo';

export type ArrowsState = {
  recentStorage: any;
  storage: any;
  diagramName: string;
  graph: StateWithHistory<Graph>;
  selection: any;
  mouse: any;
  gestures: any;
  guides: any;
  applicationLayout: any;
  viewTransformation: any;
  actionMemos: ActionMemosState;
  applicationDialogs: ApplicationDialogsState;
  features: any;
  googleDrive: any;
  cachedImages: Record<string, ImageInfo>;
  ontologies: OntologyState;
};

const arrowsApp = combineReducers<ArrowsState>({
  recentStorage,
  storage,
  diagramName,
  graph,
  selection,
  mouse,
  gestures,
  guides,
  applicationLayout,
  viewTransformation,
  actionMemos,
  applicationDialogs,
  features,
  googleDrive,
  cachedImages,
  ontologies,
});

export default arrowsApp;
