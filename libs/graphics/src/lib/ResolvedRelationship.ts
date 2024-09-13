import { Graph, Relationship } from '@neo4j-arrows/model';
import { VisualNode } from './VisualNode';
import { VisualAttachment } from './VisualAttachment';

export class ResolvedRelationship {
  // id(selection: EntitySelection, id: any): any {
  //   throw new Error("Method not implemented.");
  // }
  get id() {
    return this.relationship.id;
  }
  get type() {
    return this.relationship.type;
  }
  constructor(
    readonly relationship: Relationship,
    readonly from: VisualNode,
    readonly to: VisualNode,
    readonly startAttachment: VisualAttachment,
    readonly endAttachment: VisualAttachment,
    readonly selected: boolean,
    readonly graph: Graph
  ) {}
}
