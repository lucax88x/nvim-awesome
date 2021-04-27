import { is } from 'ramda';

export function isString(obj: unknown): obj is string {
  return is(String, obj);
}

export function isNumber(obj: unknown): obj is number {
  return is(Number, obj);
}

export function isBoolean(obj: unknown): obj is boolean {
  return is(Boolean, obj);
}

export function isArray<T>(obj: unknown): obj is Array<T> {
  return is(Array, obj);
}

export const isServer = typeof window === 'undefined';
