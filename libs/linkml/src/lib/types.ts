export type Attribute = {
  range?: string;
  description?: string;
  multivalued?: boolean;
  required?: boolean;
  annotations?: Record<string, string>;
};

export enum SpiresCoreClasses {
  NamedEntity = 'NamedEntity',
  RelationshipType = 'RelationshipType',
  TextWithEntity = 'TextWithEntity',
  TextWithTriples = 'TextWithTriples',
  Triple = 'Triple',
}

export type LinkMLClass = {
  attributes?: Record<string, Attribute>;
  description?: string;
  id_prefixes?: string[];
  is_a?: SpiresCoreClasses | string;
  mixins?: SpiresCoreClasses[] | string[];
  slot_usage?: Record<string, Attribute>;
  tree_root?: boolean;
  annotations?: Record<string, string>;
};

export type LinkML = {
  id: string;
  default_range?: string;
  name: string;
  prefixes: Record<string, string>;
  title: string;
  classes: Record<string, LinkMLClass>;
  imports?: string[];
  license?: string;
};

export enum SpiresType {
  LINKML = 'LinkML',
  RE = 'Spires RE',
  ER = 'Spires ER',
}
