import _ from 'lodash'
import { throwException, TMethodNode } from '../utils'
import math from './math'
import text from './text'
import date from './date'
import logic from './logic'

export { math, text, date, logic }

export type Method = (...args: any[]) => any

type MethodMap = Record<string, Method>

export type Methods = Record<string, Method|MethodMap>

export interface Context {
  text: string
  data: Record<string, any>
  alias: Record<string, string>
}


export const operator = {
  register: function register(name: string, method: Method): () => void {
    _.set(this, name, method)
    return () => operator.unregister.call(this, name)
  },
  unregister: function unregister(name: string): void {
    _.unset(this, name)
  },
  caller: async function caller(methodNode: TMethodNode, ctx: Context): Promise<any> {
    const { name } = methodNode.content
    const alias = _.has(ctx.alias, name) ? ctx.alias[name] : name
    const { params } = methodNode.content
    if (!_.has(this, alias)) {
      throwException(8, name)
    }
    try {
      methodNode.content.value = _.get(this, alias).apply(
        this,
        params.map((param) => param.content.value)
      )
    } catch (err: any) {
      throwException(1002, name, err.message)
    }
    return methodNode
  },
}

export const global_methods: Methods = {
  ...math,
  ...text,
  ...date,
  ...logic
}

export const useMethods = () => {
  const methods: Methods = {
    // [Register]: (name: string, method: Methods) =>
    // operator[Register].call(methods, name, method),
    // [Unregister]: (name: string) => operator[Unregister].call(methods, name),
    // [Caller]: (methodNode: Node, ctx: any) => {
    //   const self = merge({}, global_methods, methods)
    //   return operator[Caller].call(self, methodNode, ctx)
    // },
  }
  return methods
}
