import _ from 'lodash'
import { TNodeType } from './utils'
import { TokenizeState } from './tokenizer'

export function isEmpty(this: TokenizeState, ch: string): boolean {
  return ch === ''
}

export function isSpace(this: TokenizeState, ch: string): boolean {
  return /[\s\t\n\r]/.test(ch)
}

export function isGroupStart(this: TokenizeState, ch: string): boolean {
  return ch === '('
}

export function isGroupEnd(this: TokenizeState, ch: string): boolean {
  return ch === ')'
}

export function isOperator(this: TokenizeState, ch: string): boolean {
  return /[\+\-\*\/\<\>\=]/.test(ch)
}

export function isNumber(this: TokenizeState, ch: string): boolean {
  return /[\d\.]/.test(ch)
}

export function isText(this: TokenizeState, ch: string): boolean {
  return ch === "'" || ch === '"'
}

export function isVariable(this: TokenizeState, ch: string): boolean {
  return ch === '{'
}

export function isMethod(this: TokenizeState, ch: string): boolean {
  return ch === '$'
}

export function isComma(this: TokenizeState, ch: string): boolean {
  return ch === ','
}

export function isIn(this: TokenizeState, type: TNodeType): boolean {
  const outer = this.stack[this.stack.length - 1]
  return this.depth > 0 && _.get(outer, 'last.type', '') === type
}

export function isBegin(this: TokenizeState): boolean {
  return !this.last
}

export function isBehind(this: TokenizeState, ...types: TNodeType[]): boolean {
  return !!this.last && types.indexOf(this.last.type) > -1
}
