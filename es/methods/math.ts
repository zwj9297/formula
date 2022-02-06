import Big from 'big.js'
import { throwException } from '../utils'

/** 是否数字 */
export const isNumber = (n: any): boolean => typeof n === 'number'
/** 是否数字组成的数组 */
export const isNumberArray = (ns: any[]): boolean => ns.every(isNumber)
/** 是否有效数字（非NaN和Infinity） */
export const isValidNumber = (n: any): boolean =>
  isNumber(n) && !isNaN(n) && n !== Infinity && n !== -Infinity
/** 是否有效数字组成的数组（非NaN和Infinity） */
export const isValidNumberArray = (ns: any[]): boolean => ns.every(isValidNumber)

/**
 * 数字转字符串
 * @param number 数值
 * @returns `string`
 */
export function text(number: number): string {
  if (arguments.length !== 1) throwException(101, 1, arguments.length)
  if (!isNumber(number)) throwException(1)
  if (!isValidNumber(number)) throwException(11)
  return number.toString()
}

/**
 * 数值相加
 * @param ...numbers 数值
 * @returns 相加结果值
 */
export function add(...numbers: number[]): number {
  if (numbers.length < 2) throwException(100, 2)
  if (!isNumberArray(numbers)) throwException(1)
  if (!isValidNumberArray(numbers)) throwException(11)
  const result = numbers.map((n) => new Big(n)).reduce((pn, cn) => pn.add(cn))
  return Number(result.toString())
}

/**
 * 数值相减
 * @param  ...numbers 数值
 * @returns 相减结果值
 */
export function minus(...numbers: number[]): number {
  if (numbers.length < 2) throwException(100, 2)
  if (!isNumberArray(numbers)) throwException(1)
  if (!isValidNumberArray(numbers)) throwException(11)
  const result = numbers.map((n) => new Big(n)).reduce((pn, cn) => pn.minus(cn))
  return Number(result.toString())
}

/**
 * 数值相乘
 * @param ...numbers 数值
 * @returns 相乘结果值
 */
export function multi(...numbers: number[]): number {
  if (numbers.length < 2) throwException(100, 2)
  if (!isNumberArray(numbers)) throwException(1)
  if (!isValidNumberArray(numbers)) throwException(11)
  const result = numbers.map((n) => new Big(n)).reduce((pn, cn) => pn.mul(cn))
  return Number(result.toString())
}

/**
 * 数值相除
 * @param  ...numbers 数值数组
 * @returns 相除结果值
 */
export function div(...numbers:number[]): number {
  if (numbers.length < 2) throwException(100, 2)
  if (!isNumberArray(numbers)) throwException(1)
  if (!isValidNumberArray(numbers)) throwException(11)
  if (numbers.slice(1).some((n) => n === 0)) throwException(12)
  const result = numbers.map((n) => new Big(n)).reduce((pn, cn) => pn.div(cn))
  return Number(result.toString())
}

/**
 * 求平均值
 * @param ...numbers 数值
 * @returns 平均值
 */
export function average(...numbers: number[]): number {
  if (numbers.length < 2) throwException(100, 2)
  return div(add(...numbers), numbers.length)
}

/**
 * 用定点小数格式
 * @param number 数值
 * @param decimals 小数位
 * @returns 格式化小数
 */
export function fixed(number: number, decimals: number = 2): string {
  if (arguments.length < 1 || arguments.length > 2)
    throwException(101, 1, 2, arguments.length)
  if (!isNumberArray([number, decimals])) throwException(1)
  if (!isValidNumberArray([number, decimals])) throwException(11)
  if (decimals < 0) throwException(14)
  return new Big(number).toFixed(decimals)
}

/**
 * 求幂
 * @param x 底数
 * @param y 指数
 * @returns 幂
 */
export function pow(x: number, y: number): number {
  if (arguments.length < 1 || arguments.length > 2)
    throwException(102, 1, 2, arguments.length)
  if (!isNumberArray([x, y])) throwException(1)
  if (!isValidNumberArray([x, y])) throwException(11)
  const result = new Big(x).pow(y)
  return Number(result.toString())
}

/**
 * 判断大于等于
 * @param  x 数值
 * @param  y 数值
 * @returns 是否
 */
export function gte(x: number, y: number): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isNumberArray([x, y])) throwException(1)
  if (!isValidNumberArray([x, y])) throwException(11)
  return new Big(x).gte(y)
}

/**
 * 判断大于
 * @param  x 数值
 * @param  y 数值
 * @returns 是否
 */
export function gt(x: number, y: number): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isNumberArray([x, y])) throwException(1)
  if (!isValidNumberArray([x, y])) throwException(11)
  return new Big(x).gt(y)
}

/**
 * 判断小于等于
 * @param  x 数值
 * @param  y 数值
 * @returns 是否
 */
export function lte(x: number, y: number): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isNumberArray([x, y])) throwException(1)
  if (!isValidNumberArray([x, y])) throwException(11)
  return new Big(x).lte(y)
}

/**
 * 判断小于
 * @param  x 数值
 * @param  y 数值
 * @returns 是否
 */
export function lt(x: number, y: number): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isNumberArray([x, y])) throwException(1)
  if (!isValidNumberArray([x, y])) throwException(11)
  return new Big(x).lt(y)
}

/**
 * 判断相等
 * @param  x 数值
 * @param  y 数值
 * @returns 是否
 */
export function eq(x: number, y: number): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isNumberArray([x, y])) throwException(1)
  if (!isValidNumberArray([x, y])) throwException(11)
  return new Big(x).eq(y)
}

/**
 * 判断不相等
 * @param  x 数值
 * @param  y 数值
 * @returns 是否
 */
export function neq(x: number, y: number): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isNumberArray([x, y])) throwException(1)
  if (!isValidNumberArray([x, y])) throwException(11)
  return !new Big(x).eq(y)
}

export default {
  text,
  Math: {
    add,
    minus,
    multi,
    div,
    average,
    pow,
    fixed,
    gte,
    gt,
    lte,
    lt,
    eq,
    neq,
  },
}
