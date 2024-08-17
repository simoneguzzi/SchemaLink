type Link = {
  href: string;
};

type Page = {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
};

type Links = {
  first: Link;
  self: Link;
  next: Link;
  last: Link;
};

export type OntologyConfig = {
  id: string;
  description: string;
  title: string;
  fileLocation: string;
};

type OntologiesEmbedded = {
  ontologies: { config: OntologyConfig }[];
};

export type OntologiesJson = {
  _embedded: OntologiesEmbedded;
  links: Links;
  page: Page;
};

type Term = { label: string; obo_id: string };

type OntologyEmbedded = { terms: Term[] };

export type OntologyJson = {
  _embedded: OntologyEmbedded;
};
