import { format, addSeconds } from 'date-fns';
import NL_LOCALE from 'date-fns/locale/nl';
import { DEFAULT_DATE_FORMAT } from 'App.constants';
import { KeyboardEvent, MouseEvent } from 'react';

export function dateFormat(date: string | Date, fmt: string): string {
  return format(date, fmt, { locale: NL_LOCALE });
}

export function defaultDateFormat(date: string | Date): string {
  return dateFormat(date, DEFAULT_DATE_FORMAT);
}

export function formattedTimeFromSeconds(seconds: number) {
  return dateFormat(addSeconds(new Date(0), seconds), 'mm:ss');
}

// https://github.com/Microsoft/TypeScript/issues/21826#issuecomment-479851685
export const entries = Object.entries as <T>(
  o: T
) => [Extract<keyof T, string>, T[keyof T]][];

// Repeating conditions for accessible keyboard event
export function withKeyPress<T>(fn: Function, keyName: string = 'enter') {
  return (event: KeyboardEvent<T> | MouseEvent<T>) => {
    if (!('key' in event) || event.key.toLowerCase() === keyName) {
      fn(event);
    }
  };
}

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}
