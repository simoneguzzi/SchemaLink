import React, { Component } from 'react';
import { Form, Button, Table, Message } from 'semantic-ui-react';
import { PropertyRow } from './PropertyRow';
import { Properties, PropertiesSummary, Property } from '@neo4j-arrows/model';

const objectToList = (
  object: Properties
): { key: string; value: Property }[] => {
  return Object.keys(object).map((key) => ({
    key,
    value: object[key],
  }));
};

interface PropertyTableProps {
  properties: Properties;
  propertySummary: PropertiesSummary;
  onMergeOnValues: (key: string) => void;
  onSavePropertyKey: (oldKey: string | null, newKey: string) => void;
  onSavePropertyValue: (key: string, value: string) => void;
  onDeleteProperty: (key: string) => void;
}

interface PropertyTableState {
  local: boolean;
  properties: { key: string; value: Property }[] | null;
  error: string | null;
  lastValidKey: string | null;
  invalidIndex: number | null;
}

export default class PropertyTable extends Component<
  PropertyTableProps,
  PropertyTableState
> {
  constructor(props: PropertyTableProps) {
    super(props);
    this.focusHandlers = [];
    this.state = {
      local: false,
      properties: null,
      error: null,
      lastValidKey: null,
      invalidIndex: null,
    };
  }

  focusHandlers: unknown[];

  static propertyInput(property: Property) {
    switch (property.status) {
      case 'CONSISTENT':
        return { valueFieldValue: property.value, valueFieldPlaceHolder: null };

      case 'INCONSISTENT':
        return {
          valueFieldValue: '',
          valueFieldPlaceHolder: '<multiple values>',
        };

      default:
        return {
          valueFieldValue: '',
          valueFieldPlaceHolder: '<partially present>',
        };
    }
  }

  render() {
    const {
      properties,
      propertySummary,
      onMergeOnValues,
      onSavePropertyKey,
      onSavePropertyValue,
      onDeleteProperty,
    } = this.props;
    const {
      properties: localProperties,
      local,
      error,
      lastValidKey,
      invalidIndex,
    } = this.state;

    let propertiesList;
    if (local) {
      propertiesList = localProperties;
    } else {
      propertiesList = objectToList(properties);
    }

    const addEmptyProperty = () => {
      onSavePropertyValue('', '');
    };

    const onNextProperty = (nextIndex: number) => {
      if (nextIndex === propertiesList?.length) {
        addEmptyProperty();
      } else {
        this.focusHandlers[nextIndex]();
      }
    };

    const onPropertyKeyChange = (
      propertyKey: string,
      value: string,
      index: number
    ) => {
      if (local) {
        if (!propertiesList?.find((prop) => prop.key === value)) {
          // switch to global
          onSavePropertyKey(lastValidKey, value);
          this.setState({
            local: false,
            error: null,
            properties: null,
            lastValidKey: null,
            invalidIndex: null,
          });
        }
      } else {
        if (propertiesList?.find((prop) => prop.key === value)) {
          const property = propertiesList.find(
            (prop) => prop.key === propertyKey
          );
          if (property) {
            property.key = value;
            this.setState({
              local: true,
              error: 'Duplicate attributes found. Please rename the attribute.',
              properties: propertiesList,
              lastValidKey: propertyKey,
              invalidIndex: index,
            });
          }
        } else {
          onSavePropertyKey(propertyKey, value);
        }
      }
    };

    const rows = propertiesList?.map((prop, index) => {
      const { valueFieldValue, valueFieldPlaceHolder } =
        PropertyTable.propertyInput(prop.value);
      return (
        <PropertyRow
          key={'row-' + index}
          propertyKey={prop.key}
          propertySummary={propertySummary}
          onMergeOnValues={() => onMergeOnValues(prop.key)}
          onKeyChange={(newKey) => onPropertyKeyChange(prop.key, newKey, index)}
          onValueChange={(newValue) => onSavePropertyValue(prop.key, newValue)}
          onDeleteProperty={() => onDeleteProperty(prop.key)}
          valueFieldValue={valueFieldValue}
          valueFieldPlaceHolder={valueFieldPlaceHolder}
          setFocusHandler={(action) => (this.focusHandlers[index] = action)}
          onNext={() => onNextProperty(index + 1)}
          keyDisabled={!!error && invalidIndex !== index}
          valueDisabled={!!error}
        />
      );
    });
    return (
      <Form.Field key="propertiesTable">
        <label>Attributes</label>
        <Table compact collapsing style={{ marginTop: 0 }}>
          <Table.Body>{rows}</Table.Body>
        </Table>
        {error ? <Message negative>{error}</Message> : null}
        <Button
          key="addProperty"
          onClick={addEmptyProperty}
          basic
          color="black"
          floated="right"
          size="tiny"
          icon="plus"
          content="Attribute"
          type="button"
          disabled={!!error}
        />
      </Form.Field>
    );
  }
}
