import React, { Component } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';

type DropdownProps = {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
};

export default class extends Component<DropdownProps> {
  render() {
    const { value, placeholder, options, onChange } = this.props;

    const textAndValueOptions = options.map((value) => ({
      text: value,
      value,
    }));
    const trigger = <span>{placeholder || value}</span>;
    return (
      <Form.Field>
        <Dropdown
          trigger={trigger}
          options={textAndValueOptions}
          defaultValue={value}
          onChange={(e, { value }) => onChange(value as string)}
        />
      </Form.Field>
    );
  }
}
