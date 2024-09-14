import { Ontology } from '@neo4j-arrows/model';
import { OntologiesAction } from '../reducers/ontologies';

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
