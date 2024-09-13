import {
  loadOntologiesFailure,
  loadOntologiesRequest,
  loadOntologiesSuccess,
  loadOntologyExamplesFailure,
  loadOntologyExamplesRequest,
  loadOntologyExamplesSuccess,
} from '../actions/ontologies';
import { Action, Dispatch, Store } from 'redux';
import { Graph, ontologies as hardcodedOntologies } from '@neo4j-arrows/model';
import {
  examples,
  ontologies,
  ontologiesCount,
} from '@neo4j-arrows/ontology-search';
import { getGraph } from '../selectors';
import { ArrowsState } from '../reducers';

export const fetchOntologiesMiddleware =
  (store: Store<ArrowsState>) => (next: Dispatch) => (action: Action) => {
    const onFailedLoadOntologies = () => {
      store.dispatch(loadOntologiesFailure());
      store.dispatch(loadOntologyExamplesRequest());
      store.dispatch(loadOntologyExamplesSuccess(hardcodedOntologies));
    };

    const result = next(action);

    if (action.type === 'GETTING_GRAPH') {
      store.dispatch(loadOntologiesRequest());
      ontologiesCount()
        .then((count) => {
          ontologies(count)
            .then((ontologies) => {
              store.dispatch(loadOntologiesSuccess(ontologies));
              const graph: Graph = getGraph(store.getState());
              const graphOntologies = [
                ...graph.nodes.flatMap((node) => node.ontologies ?? []),
                ...graph.relationships.flatMap(
                  (relationship) => relationship.ontologies ?? []
                ),
              ];
              store.dispatch(loadOntologyExamplesRequest());
              Promise.all(
                graphOntologies.map((ontology) =>
                  examples(ontology).then((examples) => {
                    return { ...ontology, examples };
                  })
                )
              )
                .then((resolvedOntologies) => {
                  store.dispatch(
                    loadOntologyExamplesSuccess(resolvedOntologies)
                  );
                })
                .catch((error) =>
                  store.dispatch(loadOntologyExamplesFailure())
                );
            })
            .catch((error) => onFailedLoadOntologies());
        })
        .catch((error) => onFailedLoadOntologies());
    }

    return result;
  };
