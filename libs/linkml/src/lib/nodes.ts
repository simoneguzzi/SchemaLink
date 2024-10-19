import { Node, Relationship, RelationshipType } from '@neo4j-arrows/model';
import { LinkMLClass, Attribute, SpiresCoreClasses } from './types';
import { toAttributeName, toClassName } from './naming';
import { toAnnotators } from './ontologies';

export const nodeToClass = (
  node: Node,
  findNode: (id: string) => Node | undefined,
  findRelationshipFromNode: (node: Node) => Relationship[]
): LinkMLClass => {
  const propertiesToAttributes = (): Record<string, Attribute> => {
    return Object.entries(node.properties).reduce(
      (
        attributes: Record<string, Attribute>,
        [key, { description, multivalued }]
      ) => ({
        ...attributes,
        [toAttributeName(key)]: {
          description,
          multivalued,
        },
      }),
      {}
    );
  };

  const nodeOntologies = node.ontologies ?? [];
  const [parent, ...rest] = findRelationshipFromNode(node)
    .filter(
      (relationship) =>
        relationship.relationshipType === RelationshipType.INHERITANCE
    )
    .map((relationship) => findNode(relationship.toId));

  return {
    is_a: parent ? toClassName(parent.caption) : SpiresCoreClasses.NamedEntity,
    description: node.description,
    mixins: rest
      .filter((parent) => !!parent)
      .map((parent) => toClassName(parent.caption)),
    attributes: propertiesToAttributes(),
    id_prefixes: nodeOntologies.map((ontology) =>
      ontology.id.toLocaleUpperCase()
    ),
    annotations: nodeOntologies.length
      ? {
          annotators: toAnnotators(nodeOntologies),
        }
      : {},
  };
};
