import _ from 'lodash'
import { useTokenizer } from './tokenizer'
import { global_methods, useMethods, operator, Method, Methods } from './methods/index'
import { useCalculator } from './calculator'

/** 注册全局函数 */
export const register = (name: string, method: Method) => {
  return operator.register.call(global_methods, name, method)
}
/** 注销全局函数 */
export const unregister = (name: string) => {
  operator.unregister.call(global_methods, name)
}

export interface Formula extends Object {
  methods: Methods
  register: (name: string, method: Method) => () => void
  unregister: (name: string) => void
  alias: Record<string, string>
  getAlias: (alias: string) => string
  setAlias: (alias: string, name: string) => void
  delAlias: (alias: string) => void
  clearAlias: () => void
  variable: Record<string, any>,
  getVariable: (path: string) => any
  setVariable: (path: string, value: any) => void
  delVariable: (path: string) => void
  clearVariable: () => void
  calc: (text: string, data: Record<string, any>) => Promise<any>
}

/** 创建公式实例 */
export const createFormula = (): Formula => {
  const tokenizer = useTokenizer()
  const methods = useMethods()
  const calculator = useCalculator(methods)
  const formula: Formula = {
    // 函数集合
    methods,
    // 注册函数
    register: operator.register.bind(methods),
    // 注销函数
    unregister: operator.unregister.bind(methods),
    alias: Object.create(null),
    // 获取别名
    getAlias: (alias) => {
      return formula.alias[alias]
    },
    // 记录别名
    setAlias: (alias, name) => {
      formula.alias[alias] = name
    },
    // 删除别名
    delAlias: (alias) => {
      delete formula.alias[alias]
    },
    // 清空别名
    clearAlias: () => {
      formula.alias = Object.create(null)
    },
    // 上下文
    variable: Object.create(null),
    // 获取上下文
    getVariable: (path) => {
      return _.get(formula.variable, path)
    },
    // 设置上下文
    setVariable: (path, value) => {
      _.set(formula.variable, path, value)
    },
    // 删除上下文
    delVariable: (path) => {
      _.unset(formula.variable, path)
    },
    // 清空上下文
    clearVariable: () => {
      formula.variable = Object.create(null)
    },
    // 计算
    calc: async (text, data = {}) => {
      const tokenize = await tokenizer(text)
      return calculator(tokenize, {
        text,
        data: _.merge({}, formula.variable, data),
        alias: _.merge({}, formula.alias),
      })
    },
  }
  return new Proxy(formula, {
    get: (target: Formula, key: string) => {
      // @ts-ignore
      if (['variable', 'alias'].indexOf(key) > -1) return merge({}, target[key])
      if (key === 'methods') return _.merge({}, global_methods, target[key])
      // @ts-ignore
      return target[key]
    },
    set: (target, key: string, value) => {
      // @ts-ignore
      if (['variable', 'alias'].indexOf(key) > -1) return merge(target[key], value)
    },
  })
}
