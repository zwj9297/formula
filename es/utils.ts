import moment from 'moment'
import { NODE_TYPES } from './enums'

export type TNodeType = 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'GROUP' | 'OPERATOR' | 'COMMA' | 'VARIABLE' | 'METHOD'

export interface TNode {
  type: TNodeType
  index: number
  content: {
    value: any
  }
  chars: string
}

export interface TOperatorNode extends TNode {
  content: {
    value: any
    type: string
  }
}

export interface TVariableNode extends TNode {
  content: {
    value: any
    key: string
  }
}

export interface TMethodNode extends TNode {
  content: {
    name: string
    params: TNode[]
    value: any
  }
}

export interface TGroupNode extends TNode {
  content: {
    body: TNode[]
    value: any
  }
}

/**
 * 创建节点
 * @param type 节点类型
 * @param index 节点在文本中的位置
 * @param content 节点内容
 * @param chars 节点对应的文本
 * @return 节点对象
 */
export const createNode = (type: TNodeType, index: number, content: any, chars: string): TNode => {
  return { type, index, content, chars }
}

/**
 * 抛出异常
 * @param type 异常类型
 * @param $1 
 * @param $2 
 * @param $3 
 */
export const throwException = (type: number, $1: any = '', $2: any = '', $3: any = ''): void => {
  let E = Error
  let message = ''
  switch (type) {
    case 0:
      E = SyntaxError
      message = 'Unexpected end of input.'
      break
    case 1:
      E = SyntaxError
      message = 'Unexpected number.'
      break
    case 2:
      E = SyntaxError
      message = `Unexpected token '${$1}'.`
      break
    case 3:
      E = SyntaxError
      message = `Invalid or unexpected token.`
      break
    case 4:
      E = SyntaxError
      message = 'Unexpected string.'
      break
    case 5:
      message = 'variable name can not be empty.'
      break
    case 6:
      message = `Method $${$1} not called.`
      break
    case 7:
      E = TypeError
      message = `${$1} is not a function.`
      break
    case 8:
      E = ReferenceError
      message = `${$1} is not defined.`
      break
    case 9:
      E = SyntaxError
      message = 'Invalid date.'
      break
    case 10:
      E = SyntaxError
      message = `Unexpected ${$1}.`
      break
    case 11:
      E = SyntaxError
      message = 'Invalid number.'
      break
    case 12:
      message = 'Division by zero.'
      break
    case 13:
      E = SyntaxError
      message = 'Unexpected date.'
      break
    case 14:
      message = 'Invalid decimal places.'
      break
    case 15:
      E = SyntaxError
      message = 'Unexpected boolean.'
      break
    case 16:
      E = SyntaxError
      message = 'Invalid data.'
      break
    case 100:
      message = `At least ${$1} arguments is required.`
      break
    case 101:
      message = `Expected ${$1} arguments, but got ${$2}.`
      break
    case 102:
      message = `Expected ${$1} to ${$2} arguments, but got ${$3}`
      break
    case 103:
      message = `At most ${$1} arguments is required.`
      break
    case 1001:
      message = 'Uninitialized.'
      break
    case 1002:
      message = `[${$1}] ${$2}`
      break
  }
  throw new E(message)
}

/**
 * 判断值得类型
 * @param value 值
 * @returns 值类型
 */
export const getNodeType = (value: string): TNodeType|undefined => {
  if (typeof value === 'string') return NODE_TYPES.TEXT
  else if (typeof value === 'number') return NODE_TYPES.NUMBER
  else if (typeof value === 'boolean') return NODE_TYPES.BOOLEAN
  else if (moment.isMoment(value)) return NODE_TYPES.DATE
  throwException(16)
}
