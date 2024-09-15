import React, { Component } from 'react';
import { Button, Form, Input, Popup } from 'semantic-ui-react';

interface CaptionInspectorProps {
  value: string;
  onSaveCaption: (caption: string) => void;
  onConvertCaptionsToPropertyValues: () => void;
}

export class CaptionInspector extends Component<CaptionInspectorProps> {
  render() {
    const { value, onSaveCaption, onConvertCaptionsToPropertyValues } =
      this.props;

    const fieldValue = value || '';
    const placeholder = value === undefined ? '<multiple values>' : null;

    const textBox = (
      <Input
        value={fieldValue}
        onChange={(event) => onSaveCaption(event.target.value)}
        placeholder={placeholder}
      />
    );

    const popupContent = (
      <Form>
        <Form.Field>
          <Button
            key="convertCaptionsToProperties"
            onClick={onConvertCaptionsToPropertyValues}
            basic
            color="black"
            size="tiny"
            content="Use as properties"
            type="button"
          />
        </Form.Field>
      </Form>
    );

    return (
      <Form.Field key="_caption">
        <label>Caption</label>
        <Popup
          trigger={textBox}
          content={popupContent}
          on="click"
          {...(value || value === undefined ? {} : { open: false })}
          position="bottom left"
        />
      </Form.Field>
    );
  }
}
