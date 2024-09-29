import { Entity, Id } from '@neo4j-arrows/model';
import React, { ReactElement } from 'react';
import {
  Label,
  Icon,
  Form,
  SemanticCOLORS,
  SemanticICONS,
} from 'semantic-ui-react';

export const renderCounters = (
  nodeIds: Id[],
  relationshipIds: Id[],
  onSelect: (entities: Pick<Entity, 'id' | 'entityType'>[]) => void,
  color: SemanticCOLORS
) => {
  const parts: ReactElement[] = [];

  const pushCounterPill = (
    ids: Id[],
    entityType: string,
    iconName: SemanticICONS
  ) => {
    const length = ids.length;

    const selectOneEntityType = () => {
      const entities = ids.map((id) => ({ id, entityType }));
      onSelect(entities);
    };

    function visualEntityType(entityType: string) {
      switch (entityType) {
        case 'node':
          return 'classes';
        case 'relationship':
          return 'relationships';
        default:
          return `${entityType}s`;
      }
    }

    switch (length) {
      case 0:
        break;

      default:
        parts.push(
          <Label
            as="a"
            key={visualEntityType(entityType)}
            size="large"
            color={color}
            onClick={selectOneEntityType}
          >
            <Icon name={iconName} />
            {visualEntityType(entityType) + ':'}
            <Label.Detail>{length}</Label.Detail>
          </Label>
        );
        break;
    }
  };

  pushCounterPill(nodeIds, 'node', 'circle');
  pushCounterPill(
    relationshipIds,
    'relationship',
    'long arrow alternate right'
  );

  return <Form.Field>{parts}</Form.Field>;
};
