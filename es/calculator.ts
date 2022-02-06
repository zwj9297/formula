import _ from 'lodash'
import { NODE_TYPES } from './enums'
import { createNode, getNodeType, throwException, TNodeType, TNode, TMethodNode, TGroupNode, TOperatorNode, TVariableNode } from './utils'
import { global_methods, operator, Context, Methods, Method } from './methods/index'
import {
  gt,
  gte,
  lt,
  lte,
  eq,
  neq,
  add,
  minus,
  multi,
  div,
} from './methods/math'

// 运算符权重和对应函数
const OPERATOR_MAP: Record<string, [number, Method]> = {
  '>': [1, gt],
  '>=': [1, gte],
  '<': [1, lt],
  '<=': [1, lte],
  '==': [1, eq],
  '!=': [1, neq],
  '+': [2, add],
  '-': [2, minus],
  '*': [3, multi],
  '/': [3, div],
}

const isDataNode = (node: TNode) =>
  [
    NODE_TYPES.TEXT,
    NODE_TYPES.NUMBER,
    NODE_TYPES.DATE,
    NODE_TYPES.BOOLEAN,
  ].indexOf(node.type) > -1

/**
 * 中缀表达式转换前缀表达式
 * @param {Array} source AST
 * @returns {Array}
 * @PS 详看：https://blog.csdn.net/antineutrino/article/details/6763722?reload
 */
const transform = (source: TNode[]): TNode[] => {
  source = _.cloneDeep(source)
  const stack1: TNode[] = [],
    stack2: TNode[] = []
  let len = source.length
  while (len--) {
    const target = source[len]
    if (isDataNode(target) || target.type === NODE_TYPES.VARIABLE)
      stack2.push(target)
    else if (target.type === NODE_TYPES.GROUP) {
      (target as TGroupNode).content.body = transform((target as TGroupNode).content.body)
      stack2.push(target)
    } else if (target.type === NODE_TYPES.METHOD) {
      const stack3: TMethodNode[] = [target as TMethodNode]
      while (stack3.length) {
        const current = stack3.shift() as TMethodNode
        current.content.params.forEach((param) => {
          if (param.type === NODE_TYPES.METHOD) {
            stack3.push(param as TMethodNode)
          } else if (param.type === NODE_TYPES.GROUP) {
            (param as TGroupNode).content.body = transform((param as TGroupNode).content.body)
          }
        })
      }
      stack2.push(target)
    } else if (target.type === NODE_TYPES.OPERATOR) {
      // 遇到运算符
      let loop = true
      while (loop) {
        const last = stack1.pop()
        if (!last) {
          stack1.push(target)
          loop = false
        } else if (
          OPERATOR_MAP[(target as TOperatorNode).content.type][0] >=
          OPERATOR_MAP[(last as TOperatorNode).content.type][0]
        ) {
          stack1.push(last, target)
          loop = false
        } else {
          stack2.push(last)
        }
      }
    }
  }
  while (stack1.length) {
    stack2.push(stack1.pop() as TNode)
  }
  return stack2
}

const calc = async (nodes: TNode[], ctx: Context, methods: Methods): Promise<any> => {
  const source = _.cloneDeep(nodes)
  const stack: TNode[] = []
  const len = source.length
  for (let index = 0; index < len; index++) {
    const node = source[index]
    if (isDataNode(node)) {
      stack.push(node)
    } else if (node.type === NODE_TYPES.VARIABLE) {
      const { key } = (node as TVariableNode).content
      if (!_.has(ctx.data, key)) {
        throwException(8, key)
      }
      node.content.value = _.get(ctx.data, key)
      stack.push(node)
    } else if (node.type === NODE_TYPES.OPERATOR) {
      const n1 = stack.pop() as TNode,
        n2 = stack.pop() as TNode
      const chars = ctx.text.substring(n1.index, n2.index + n2.chars.length)
      try {
        const res: any = await OPERATOR_MAP[(node as TOperatorNode).content.type][1].call(
          null,
          n1.content.value,
          n2.content.value
        )
        stack.push(
          createNode(getNodeType(res) as TNodeType, n1.index, { value: res }, chars)
        )
      } catch (err: any) {
        throwException(1002, chars, err.message)
      }
    } else if (node.type === NODE_TYPES.GROUP) {
      const result = await calc((node as TGroupNode).content.body, ctx, methods)
      node.content.value = result.content.value
      stack.push(node)
    } else if (node.type === NODE_TYPES.METHOD) {
      for (const param of (node as TMethodNode).content.params) {
        if (
          param.type === NODE_TYPES.GROUP ||
          param.type === NODE_TYPES.METHOD ||
          param.type === NODE_TYPES.VARIABLE
        ) {
          const {
            content: { value },
          } = await calc([param], ctx, methods)
          param.content.value = value
        }
      }
      stack.push(await operator.caller.call(_.merge({}, global_methods, methods), (node as TMethodNode), ctx ))
    }
  }
  return stack[0]
}

export const useCalculator = (methods: Methods) => {
  const transformCache = new Map()
  return (source: TNode[], ctx: Context): Promise<any> => {
    let transformResult = transformCache.get(source) || transform(source)
    transformCache.set(source, transformResult)
    return calc(transformResult, ctx, methods).then((res) => res.content.value)
  }
}
