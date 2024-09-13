import { Id, Relationship } from '@neo4j-arrows/model';
import { VisualNode } from './VisualNode';
import { VisualAttachment } from './VisualAttachment';

export class ResolvedRelationship {
  id: Id;
  relationship: Relationship;
  from: VisualNode;
  to: VisualNode;
  startAttachment: VisualAttachment;
  endAttachment: VisualAttachment;
  selected: boolean;
  type: string;

  constructor(
    relationship: Relationship,
    from: VisualNode,
    to: VisualNode,
    startAttachment: VisualAttachment,
    endAttachment: VisualAttachment,
    selected: boolean
  ) {
    this.id = relationship.id;
    this.relationship = relationship;
    this.from = from;
    this.to = to;
    this.startAttachment = startAttachment;
    this.endAttachment = endAttachment;
    this.selected = selected;
    this.type = relationship.type;
  }
}
