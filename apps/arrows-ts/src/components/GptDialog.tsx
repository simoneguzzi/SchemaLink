import { Button, Segment, TextArea } from 'semantic-ui-react';

interface GtpDialogProps {
  loading: boolean;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick: () => void;
}

export const GptDialog = ({ loading, onChange, onClick }: GtpDialogProps) => (
  <Segment
    style={{
      boxShadow: 'none',
    }}
    loading={loading}
  >
    <TextArea
      style={{
        fontFamily: 'monospace',
        marginBottom: 8,
      }}
      onChange={onChange}
    />
    <Button secondary onClick={onClick}>
      Generate
    </Button>
  </Segment>
);
