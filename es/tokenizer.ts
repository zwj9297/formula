import _ from 'lodash'
import { NODE_TYPES, OPERATOR_WEIGHT } from './enums'
import * as assert from './assert'
import { createNode, TGroupNode, throwException, TMethodNode, TNode, TNodeType } from './utils'

export interface TBaseState {
  depth: number
  last: TNode|null
  resolve: TNode[],
  tokenize: (value?: TNode[]) => boolean|void
}

export interface TStackState {
  stack: TBaseState[]
  sink: () => void
  surface: () => this
  push: (type: TNodeType, index: number, content: any, chars: string) => void
}

export interface TAssertState {
  $isEmpty: (ch: string) => boolean
  $isSpace: (ch: string) => boolean
  $isGroupStart: (ch: string) => boolean
  $isGroupEnd: (ch: string) => boolean
  $isOperator: (ch: string) => boolean
  $isNumber: (ch: string) => boolean
  $isText: (ch: string) => boolean
  $isVariable: (ch: string) => boolean
  $isMethod: (ch: string) => boolean
  $isComma: (ch: string) => boolean
  $isIn: (type: TNodeType) => boolean
  $isBegin: () => boolean
  $isBehind: (...types: TNodeType[]) => boolean
}

export interface TokenizeState extends TBaseState, TStackState, TAssertState {
  text: string
  index: number
  $setTokenizeGroup: (depth: number) => void
  $setTokenizeNumber: (sign?: string) => void
  $setTokenizeOperator: () => void
  $setTokenizeText: (qm: string) => void
  $setTokenVariable: () => void
  $setTokenizeMethod: () => void
  $tokenizeBase: () => void
}

function setTokenizeGroup(this: TokenizeState) {
  const originIndex = this.index
  this.push(NODE_TYPES.GROUP, this.index, { body: [] }, '()')
  this.index++
  this.tokenize = function tokenizeGroupEnd(value = []) {
    const last = this.resolve[this.resolve.length - 1] as TGroupNode
    last.content.body = value
    last.chars = this.text.substring(originIndex, this.index + 1)
    this.tokenize = function tokenizeGroup() {
      const ch = this.text.charAt(this.index)
      if (this.$isGroupEnd(ch)) {
        this.index++
        this.tokenize = this.$tokenizeBase
      } else if (this.$isEmpty(ch)) {
        throwException(0)
      }
    }
  }
  this.sink()
}

function setTokenizeNumber(this: TokenizeState, sign = '') {
  let n = '',
    hasDecimal = 0
  const originIndex = this.index
  this.tokenize = function tokenNumber() {
    const ch = this.text.charAt(this.index)
    if (/[\d\.]/.test(ch)) {
      if (ch === '.') hasDecimal++
      n += ch
      this.index++
    } else {
      if (hasDecimal >= 2) {
        throwException(1)
      } else if (n === '' && sign) {
        throwException(0)
      } else if (n === '.') {
        throwException(2, '.')
      } else if (n.length) {
        this.push(
          NODE_TYPES.NUMBER,
          originIndex,
          { value: Number(sign + n) },
          sign + n
        )
      }
    }
  }
}

function setTokenizeOperator(this: TokenizeState) {
  let operator = ''
  const originIndex = this.index
  this.tokenize = function tokenOperator() {
    let ch = this.text.charAt(this.index)
    if (this.$isOperator(ch)) {
      operator += ch
      this.index++
    } else if (OPERATOR_WEIGHT.hasOwnProperty(operator)) {
      if (
        /[\+\-]/.test(operator) /** 以正负号开头 */ &&
        (this.$isBegin() /** 作为表达式开头 */ ||
          this.$isBehind(NODE_TYPES.OPERATOR) /** 跟随表达式后面 */ ||
          (this.$isIn(NODE_TYPES.METHOD) &&
            this.$isBehind(NODE_TYPES.COMMA))) /** 在函数里且在逗号后面 */
      ) {
        this.$setTokenizeNumber(operator)
      } else if (
        this.$isBehind(
          NODE_TYPES.NUMBER,
          NODE_TYPES.GROUP,
          NODE_TYPES.VARIABLE,
          NODE_TYPES.METHOD
        )
      ) {
        this.push(
          NODE_TYPES.OPERATOR,
          originIndex,
          { type: operator },
          operator
        )
      } else {
        throwException(2, operator)
      }
    } else {
      throwException(2, operator)
    }
  }
}

function setTokenizeText(this: TokenizeState, qm: '\''|'"') {
  let str = ''
  const originIndex = this.index
  this.index++
  this.tokenize = function tokenizeText() {
    const ch = this.text.charAt(this.index)
    if (ch === '') {
      throwException(3)
    } else if (ch === qm) {
      if (this.$isBegin() || this.$isIn(NODE_TYPES.METHOD)) {
        this.push(
          NODE_TYPES.TEXT,
          originIndex,
          { value: str },
          `${qm}${str}${qm}`
        )
      } else if (this.$isBehind(NODE_TYPES.OPERATOR)) {
        throwException(1)
      } else {
        throwException(4)
      }
    } else {
      str += ch
    }
    this.index++
  }
}

function setTokenVariable(this: TokenizeState) {
  let key = ''
  const originIndex = this.index
  this.index++
  this.tokenize = function TokenVariable() {
    const ch = this.text.charAt(this.index)
    if (ch === '}') {
      if (this.$isEmpty(key)) throwException(5)
      this.push(NODE_TYPES.VARIABLE, originIndex, { key }, `{${key}}`)
    } else if (this.$isEmpty(ch)) {
      throwException(0)
    } else {
      key += ch
    }
    this.index++
  }
}

function setTokenizeMethod(this: TokenizeState) {
  let name = ''
  let readName = true
  const originIndex = this.index
  this.index++
  const toGroup = (resolve: TNode[]) => {
    if (resolve.length > 1) {
      const startIndex = resolve[0].index
      const endItem = resolve[resolve.length - 1]
      const endIndex = endItem.index + endItem.chars.length
      return createNode(
        NODE_TYPES.GROUP,
        startIndex,
        { body: [...resolve] },
        this.text.substring(startIndex, endIndex)
      )
    } else {
      return resolve[0]
    }
  }
  this.tokenize = function tokenizeMethod(this: TokenizeState) {
    const ch = this.text.charAt(this.index)
    if (this.$isGroupStart(ch)) {
      this.push(NODE_TYPES.METHOD, originIndex, { name, params: [] }, name)
      this.index++
      readName = false
      this.tokenize = function tokenizeMethodEnd(value) {
        let i = 0
        let cache = []
        const newValue = []
        if (value && value.length) {
          while (i < value.length) {
            const v = value[i]
            if (v.type === NODE_TYPES.COMMA) {
              if (!cache.length) {
                throwException(2, ',')
              } else {
                newValue.push(toGroup(cache))
              }
              cache = []
            } else {
              cache.push(v)
            }
            i++
          }
        }
        if (cache.length) newValue.push(toGroup(cache))
        const last = this.resolve[this.resolve.length - 1] as TMethodNode
        last.content.params = newValue
        last.chars = this.text.substring(originIndex, this.index + 1)
        this.tokenize = tokenizeMethod
      }
      this.sink()
    } else if (this.$isGroupEnd(ch)) {
      this.index++
      this.tokenize = this.$tokenizeBase
    } else if (!this.$isEmpty(ch)) {
      name += ch
      this.index++
    } else {
      if (readName) {
        if (!this.$isEmpty(ch)) {
          name += ch
          this.index++
        } else if (name) {
          throwException(6, name)
        } else {
          throwException(2, '$')
        }
      } else {
        throwException(0)
      }
    }
  }
}

function tokenizeBase(this: TokenizeState) {
  const ch = this.text.charAt(this.index)
  if (this.$isEmpty(ch)) {
    if (this.stack.length) {
      const { resolve } = this
      this.surface().tokenize(resolve)
    } else {
      if (this.last && this.last.type === NODE_TYPES.OPERATOR) {
        throwException(0)
      }
      return false
    }
  } else if (this.$isSpace(ch)) {
    this.index++
  } else if (this.$isGroupStart(ch)) {
    if (!this.$isBegin() && !this.$isBehind(NODE_TYPES.OPERATOR)) {
      throwException(7, _.get(this, 'last.chars', ''))
    }
    this.$setTokenizeGroup(this.depth)
  } else if (this.$isGroupEnd(ch)) {
    const { resolve } = this
    this.surface().tokenize(resolve)
  } else if (this.$isNumber(ch)) {
    if (
      this.$isBegin() ||
      this.$isBehind(NODE_TYPES.OPERATOR) ||
      (this.$isIn(NODE_TYPES.METHOD) && this.$isBehind(NODE_TYPES.COMMA))
    ) {
      this.$setTokenizeNumber()
    } else {
      throwException(1)
    }
  } else if (this.$isOperator(ch)) {
    this.$setTokenizeOperator()
  } else if (this.$isText(ch)) {
    this.$setTokenizeText(ch)
  } else if (this.$isVariable(ch)) {
    this.$setTokenVariable()
  } else if (this.$isMethod(ch)) {
    this.$setTokenizeMethod()
  } else if (this.$isComma(ch)) {
    if (this.$isIn(NODE_TYPES.METHOD)) {
      this.push(NODE_TYPES.COMMA, this.index, {}, ch)
      this.index++
    } else {
      throwException(2, ',')
    }
  } else {
    throwException(2, ch)
  }
}

const useStack = (state: TokenizeState) => {
  Object.defineProperties(state, {
    stack: { value: [] },
    push: {
      value: function push(type: TNodeType, index: number, content: any, chars: string) {
        this.last = createNode(type, index, content, chars)
        this.resolve.push(this.last)
        this.tokenize = this.$tokenizeBase
      },
      writable: false,
    },
    sink: {
      value: function sink() {
        /** @todo 下潜 */
        const { depth, last, resolve, tokenize } = this
        this.stack.push({ depth, last, resolve, tokenize })
        Object.assign(this, {
          depth: this.depth + 1,
          last: null,
          resolve: [],
          tokenize: this.$tokenizeBase,
        })
        return this
      },
      writable: false,
    },
    surface: {
      value: function surface() {
        /** @todo 上浮 */
        Object.assign(this, this.stack.pop())
        return this
      },
      writable: false,
    },
  })
}

const useAssert = (state: TokenizeState) => {
  Object.defineProperties(state, {
    $isEmpty: { value: assert.isEmpty, writable: false },
    $isSpace: { value: assert.isSpace, writable: false },
    $isGroupStart: { value: assert.isGroupStart, writable: false },
    $isGroupEnd: { value: assert.isGroupEnd, writable: false },
    $isOperator: { value: assert.isOperator, writable: false },
    $isNumber: { value: assert.isNumber, writable: false },
    $isText: { value: assert.isText, writable: false },
    $isVariable: { value: assert.isVariable, writable: false },
    $isMethod: { value: assert.isMethod, writable: false },
    $isComma: { value: assert.isComma, writable: false },
    $isIn: { value: assert.isIn, writable: false },
    $isBegin: { value: assert.isBegin, writable: false },
    $isBehind: { value: assert.isBehind, writable: false },
  })
}

const useTokenize = (state: TokenizeState) => {
  Object.defineProperties(state, {
    $setTokenizeGroup: { value: setTokenizeGroup, writable: false },
    $setTokenizeNumber: { value: setTokenizeNumber, writable: false },
    $setTokenizeOperator: { value: setTokenizeOperator, writable: false },
    $setTokenizeText: { value: setTokenizeText, writable: false },
    $setTokenVariable: { value: setTokenVariable, writable: false },
    $setTokenizeMethod: { value: setTokenizeMethod, writable: false },
    $tokenizeBase: { value: tokenizeBase },
  })
  state.tokenize = state.$tokenizeBase
  return state
}

export const useTokenizer = () => {
  const resultCache: Record<string, Promise<TNode[]>> = {}
  return (text: string): Promise<TNode[]> => {
    const text$1 = text.trim()
    if (resultCache.hasOwnProperty(text$1)) return resultCache[text$1]
    resultCache[text$1] = new Promise((resolve) => {
      // @ts-ignore
      const state: TokenizeState = {
        text: text$1,
        index: 0,
        depth: 0,
        last: null,
        resolve: [],
        tokenize: () => {
          throwException(1001)
        },
      }
      useStack(state)
      useAssert(state)
      useTokenize(state)
      while (state.tokenize() !== false) {
        /** */
      }
      resolve(state.resolve)
    })
    return resultCache[text$1]
  }
}
