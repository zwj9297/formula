import { FormulaNodeType } from 'es/interface';
import type { TokenizeState } from './state';

export function isEmpty(_state: TokenizeState, ch: string): boolean {
  return ch === '';
}

export function isSpace(_state: TokenizeState, ch: string): boolean {
  return /[\s\t\n\r]/.test(ch);
}

export function isGroupStart(_state: TokenizeState, ch: string): boolean {
  return ch === '(';
}

export function isGroupEnd(_state: TokenizeState, ch: string): boolean {
  return ch === ')';
}

export function isOperator(_state: TokenizeState, ch: string): boolean {
  return /[\+\-\*\/\<\>\=]/.test(ch);
}

export function isNumber(_state: TokenizeState, ch: string): boolean {
  return /\d/.test(ch);
}

export function isDecimalPoint(_state: TokenizeState, ch: string): ch is '.' {
  return ch === '.';
}

export function isText(_state: TokenizeState, ch: string): ch is "'" | '"' {
  return ch === "'" || ch === '"';
}

export function isVariable(_state: TokenizeState, ch: string): boolean {
  return ch === '{';
}

export function isMethod(_state: TokenizeState, ch: string): boolean {
  return ch === '$';
}

export function isComma(_state: TokenizeState, ch: string): boolean {
  return ch === ',';
}

export function isIn(state: TokenizeState, type: FormulaNodeType): boolean {
  const outer = state.stack[state.stack.length - 1];
  return !!(state.depth > 0 && outer.last?.type && outer.last?.type & type);
}

export function isBegin(state: TokenizeState): boolean {
  return !state.last;
}

export function isBehind(
  state: TokenizeState,
  type: FormulaNodeType
  // ...types: FormulaNodeType[]
): boolean {
  return !!(state.last && type & state.last.type);
}
