import { Ontology } from '@neo4j-arrows/model';
import { Action } from 'redux';

export interface OntologiesAction
  extends Action<
    | 'LOAD_ONTOLOGIES_REQUEST'
    | 'LOAD_ONTOLOGIES_SUCCESS'
    | 'LOAD_ONTOLOGIES_FAILURE'
    | 'LOAD_ONTOLOGY_EXAMPLES_REQUEST'
    | 'LOAD_ONTOLOGY_EXAMPLES_SUCCESS'
    | 'LOAD_ONTOLOGY_EXAMPLES_FAILURE'
  > {
  ontologies?: Ontology[];
}

export const loadOntologiesRequest = (): OntologiesAction => ({
  type: 'LOAD_ONTOLOGIES_REQUEST',
});

export const loadOntologiesSuccess = (
  ontologies: Ontology[]
): OntologiesAction => ({
  type: 'LOAD_ONTOLOGIES_SUCCESS',
  ontologies,
});

export const loadOntologiesFailure = (): OntologiesAction => ({
  type: 'LOAD_ONTOLOGIES_FAILURE',
});

export const loadOntologyExamplesRequest = (): OntologiesAction => ({
  type: 'LOAD_ONTOLOGY_EXAMPLES_REQUEST',
});

export const loadOntologyExamplesSuccess = (
  ontologies: Ontology[]
): OntologiesAction => ({
  type: 'LOAD_ONTOLOGY_EXAMPLES_SUCCESS',
  ontologies,
});

export const loadOntologyExamplesFailure = (): OntologiesAction => ({
  type: 'LOAD_ONTOLOGY_EXAMPLES_FAILURE',
});
