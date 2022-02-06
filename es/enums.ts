import { TNodeType } from "./utils"

export const NODE_TYPES: Record<string, TNodeType> = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
  GROUP: 'GROUP',
  OPERATOR: 'OPERATOR', // 运算符
  COMMA: 'COMMA', // 逗号
  VARIABLE: 'VARIABLE', // 变量
  METHOD: 'METHOD', // 函数
}

// 运算符权重
export const OPERATOR_WEIGHT: Record<string, number> = {
  '>': 1,
  '>=': 1,
  '<': 1,
  '<=': 1,
  '==': 1,
  '!=': 1,
  '+': 2,
  '-': 2,
  '*': 3,
  '/': 3,
}
