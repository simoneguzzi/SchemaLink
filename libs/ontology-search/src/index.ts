import {
  OntologiesJson,
  OntologyConfig,
  OntologyPropertiesJson,
  OntologyTermsJson,
} from './lib/types';
import { Ontology } from '@neo4j-arrows/model';

const ONTOLOGIES_LIST = 'https://www.ebi.ac.uk/ols4/api/ontologies';
export const MAX_PAGE_SIZE = 1000;

const toOntology = ({
  config: { id, title, description, fileLocation },
}: {
  config: OntologyConfig;
}) => {
  return {
    id,
    description,
    name: title,
    namespace: fileLocation,
  };
};

export const ontologiesCount = async (): Promise<number> => {
  return fetch(ONTOLOGIES_LIST).then((response) =>
    response.json().then((data: OntologiesJson) => data.page.totalElements)
  );
};

export const ontologies = async (size = 20): Promise<Ontology[]> => {
  return fetch(`${ONTOLOGIES_LIST}?size=${size}`).then((response) =>
    response
      .json()
      .then((data: OntologiesJson) => data._embedded.ontologies.map(toOntology))
  );
};

export const terms = async (
  ontology: Ontology,
  size = 20
): Promise<string[]> => {
  return fetch(`${ONTOLOGIES_LIST}/${ontology.id}/terms?size=${size}`).then(
    (response) =>
      response.json().then((data: OntologyTermsJson) => {
        return data._embedded.terms
          .filter(({ obo_id }) =>
            obo_id
              .toLocaleLowerCase()
              .startsWith(ontology.id.toLocaleLowerCase())
          )
          .map(({ label }) => label);
      })
  );
};

export const properties = async (
  ontology: Ontology,
  size = 20
): Promise<string[]> => {
  return fetch(
    `${ONTOLOGIES_LIST}/${ontology.id}/properties?size=${size}`
  ).then((response) =>
    response.json().then((data: OntologyPropertiesJson) => {
      return data._embedded.properties
        .filter(({ obo_id }) =>
          obo_id.toLocaleLowerCase().startsWith(ontology.id.toLocaleLowerCase())
        )
        .map(({ label }) => label);
    })
  );
};
