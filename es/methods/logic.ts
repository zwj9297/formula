import { throwException } from '../utils'

/** 是否布尔值 */
const isBoolean = (b: boolean) => typeof b === 'boolean'
/** 是否布尔值组成的数组 */
const isBooleanArray = (bs: boolean[]) => bs.every(isBoolean)

/**
 * 输出true
 * @returns true
 */
export function true$1(): true {
  if (arguments.length > 0) throwException(101, 0, arguments.length)
  return true
}

/**
 * 输出false
 * @returns false
 */
export function false$1(): false {
  if (arguments.length > 0) throwException(101, 0, arguments.length)
  return false
}

/**
 * 判断：且
 * @param ...bools 条件值
 * @returns 是否
 */
export function and(...bools: boolean[]): boolean {
  if (bools.length < 2) throwException(100, 2)
  if (!isBooleanArray(bools)) throwException(15)
  return bools.reduce((pb, cb) => pb && cb)
}

/**
 * 判断：或
 * @param ...bools 条件值
 * @returns 是否
 */
export function or(...bools: boolean[]): boolean {
  if (bools.length < 2) throwException(100, 2)
  if (!isBooleanArray(bools)) throwException(15)
  return !!bools.reduce((pb, cb) => pb || cb)
}

/**
 * 判断：异或
 * @param ...bools 条件值
 * @returns 是否
 */
export function xor(...bools: boolean[]): boolean {
  if (bools.length < 2) throwException(100, 2)
  if (!isBooleanArray(bools)) throwException(15)
  return !!bools.reduce((pb, cb) => pb !== cb)
}

/**
 * 判断：非
 * @param bool 条件值
 * @returns 是否
 */
export function not(bool: boolean): boolean {
  if (arguments.length !== 1) throwException(101, 1, arguments.length)
  if (!isBoolean(bool)) throwException(15)
  return !bool
}

/**
 * 判断：if
 * @param bool 条件值
 * @param value_if_true 为true的结果
 * @param value_if_false 为false的结果
 * @returns 是否
 */
export function if$1<T, F>(bool: boolean, value_if_true: T, value_if_false: F): T|F {
  if (arguments.length !== 3) throwException(101, 3, arguments.length)
  if (!isBoolean(bool)) throwException(15)
  return bool ? value_if_true : value_if_false
}

export default {
  Logic: {
    true: true$1,
    false: false$1,
    and,
    or,
    xor,
    if: if$1,
    not,
  },
}
