import { Alert as DSAlert, Paragraph, AlertProps } from '@amsterdam/design-system-react';
import { ComponentChildren } from '../../../universal/types';

export interface ComponentProps {
  children?: ComponentChildren;
  title?: string;
  severity?: 'error' | 'warning' | 'info' | 'success'
}

export default function ErrorAlert({
  children,
  title = 'Foutmelding',
  severity="error"

}: ComponentProps) {
  return (
    <DSAlert title={title} severity={severity}>
      <Paragraph>{children}</Paragraph>
    </DSAlert>
  );
}

