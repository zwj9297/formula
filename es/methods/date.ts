import moment, { DurationInputArg2, Moment, unitOfTime } from 'moment'
import { isNumber, gte as mathGte, gt as mathGt, lte as mathLte, lt as mathLt, eq as mathEq, neq as mathNeq } from './math'
import { isText } from './text'
import { throwException } from '../utils'

/** 是moment对象 */
const isMoment = (m: Moment): boolean => moment.isMoment(m)
/** 是moment对象组成的数组 */
const isMomentArray = (ms: Moment[]): boolean => ms.every(isMoment)
/** 是有效的moment */
const isValidMoment = (m: Moment): boolean => isMoment(m) && m.isValid()
/** 是有效的moment对象组成的数组 */
const isValidMomentArray = (ms: Moment[]): boolean => ms.every(isValidMoment)

/**
 * 字符串转moment
 * @param text 待转换的字符串
 * @param format 格式
 * @url http://momentjs.cn/docs/#/parsing/string-format/
 * @returns moment
 */
export function date(text: string, format = 'YYYY-MM-DD HH:mm:ss'): Moment {
  if (arguments.length < 1 || arguments.length > 2) throwException(102, 1, 2, arguments.length)
  const res = moment(text, format)
  if (!isValidMoment(res)) throwException(9)
  return res
}

/**
 * 获取当前moment
 * @returns moment
 */
export function now(): Moment {
  if (arguments.length > 0) throwException(101, 0, arguments.length)
  return moment()
}

/**
 * 从moment中取值
 * @param moment moment
 * @param type 取值类型
 * @url http://momentjs.cn/docs/#/get-set/get/
 * @returns 数值
 */
export function get(m: Moment, type: unitOfTime.All = 'millisecond'): number {
  if (arguments.length < 1 || arguments.length > 2) throwException(102, 1, 2, arguments.length)
  if (!isMoment(m)) throwException(13)
  if (!isValidMoment(m)) throwException(9)
  if (!isText(type)) throwException(4)
  const res = m.get(type)
  if (!isNumber(res)) throwException(10, 'date type')
  return res
}

/**
 * 设置并输出新的moment
 * @param moment moment
 * @param n 设置的值
 * @param type 赋值类型，同get
 * @returns 新的moment
 */
export function set(m: Moment, n: number, type: unitOfTime.All = 'millisecond'): Moment {
  if (arguments.length < 2 || arguments.length > 3) throwException(102, 2, 3, arguments.length)
  if (!isMoment(m)) throwException(13)
  if (!isValidMoment(m)) throwException(9)
  if (!isNumber(n)) throwException(1)
  if (!isText(type)) throwException(4)
  if (!isNumber(m.get(type))) throwException(10, 'date type')
  const res = m.clone().set(type, n)
  if (!isValidMoment(res)) throwException(9)
  return res
}

/**
 * 计算时间差
 * @param start 开始时间
 * @param end 结束时间
 * @param type 日期类型
 * @returns 数值
 */
export function diff(start: Moment, end: Moment, type: unitOfTime.Diff = 'millisecond'): number {
  if (arguments.length < 2 || arguments.length > 3) throwException(102, 2, 3, arguments.length)
  if (!isMomentArray([start, end])) throwException(13)
  if (!isValidMomentArray([start, end])) throwException(9)
  if (!isText(type)) throwException(4)
  const res = start.diff(end, type)
  if (type !== 'millisecond' && res === start.diff(end, 'millisecond'))
    throwException(10, 'date type')
  return res
}

/**
 * 输出格式化时间
 * @param m moment
 * @param str 日期令牌
 * @url 令牌：http://momentjs.cn/docs/#/displaying/format/
 * @returns 格式化时间
 */
export function format(m: Moment, str = 'YYYY-MM-DD'): string {
  if (arguments.length < 1 || arguments.length > 2) throwException(102, 1, 2, arguments.length)
  if (!isMoment(m)) throwException(13)
  if (!isValidMoment(m)) throwException(9)
  if (!isText(str)) throwException(4)
  return m.format(str)
}

/**
 * 取最大日期
 * @param  ...moments moment数组
 * @returns moment
 */
export function max(...moments: Moment[]): Moment {
  if (moments.length < 2) throwException(100, 2)
  if (!isMomentArray(moments)) throwException(13)
  if (!isValidMomentArray(moments)) throwException(9)
  return moment.max(...moments)
}

/**
 * 取最小日期
 * @param moments moment数组
 * @returns moment
 */
export function min(...moments: Moment[]): Moment {
  if (moments.length < 2) throwException(100, 2)
  if (!isMomentArray(moments)) throwException(13)
  if (!isValidMomentArray(moments)) throwException(9)
  return moment.min(...moments)
}

/**
 * 在原有的moment的基础上增加时间并输出新的moment
 * @param m moment
 * @param n 增加数值
 * @param type 增加类型
 * @url type类型：http://momentjs.cn/docs/#/manipulating/add/
 * @returns 增加后的moment（不修改原始moment）
 */
export function add(m: Moment, n: number, type: DurationInputArg2 = 'millisecond'): Moment {
  if (arguments.length < 2 || arguments.length > 3) throwException(102, 2, 3, arguments.length)
  if (!isMoment(m)) throwException(13)
  if (!isValidMoment(m)) throwException(9)
  if (!isNumber(n) || n < 0) throwException(1)
  if (!isText(type)) throwException(4)
  const res = m.clone().add(n, type)
  if (res.valueOf() === m.valueOf()) throwException(10, 'date type')
  return res
}

/**
 * 在原有的moment的基础上减少时间并输出新的moment
 * @param m moment
 * @param n 减少数值
 * @param type 增加类型
 * @url type类型：http://momentjs.cn/docs/#/manipulating/add/
 * @returns 减少后的moment（不修改原始moment）
 */
export function minus(m: Moment, n: number, type: DurationInputArg2 = 'millisecond'): Moment {
  if (arguments.length < 2 || arguments.length > 3) throwException(102, 2, 3, arguments.length)
  if (!isMoment(m)) throwException(13)
  if (!isValidMoment(m)) throwException(9)
  if (!isNumber(n) || n > 0) throwException(1)
  if (!isText(type)) throwException(4)
  const res = m.clone().subtract(n, type)
  if (res.valueOf() === m.valueOf()) throwException(10, 'date type')
  return res
}

/**
 * 日期：判断大于等于
 * @param x moment
 * @param y moment
 * @returns 是否
 */
export function gte(x: Moment, y: Moment): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isMomentArray([x, y])) throwException(13)
  if (!isValidMomentArray([x, y])) throwException(9)
  return mathGte(x.valueOf(), y.valueOf())
}

/**
 * 日期：判断大于
 * @param x moment
 * @param y moment
 * @returns 是否
 */
export function gt(x: Moment, y: Moment): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isMomentArray([x, y])) throwException(13)
  if (!isValidMomentArray([x, y])) throwException(9)
  return mathGt(x.valueOf(), y.valueOf())
}

/**
 * 日期：判断小于等于
 * @param x moment
 * @param y moment
 * @returns 是否
 */
export function lte(x: Moment, y: Moment): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isMomentArray([x, y])) throwException(13)
  if (!isValidMomentArray([x, y])) throwException(9)
  return mathLte(x.valueOf(), y.valueOf())
}

/**
 * 日期：判断小于
 * @param x moment
 * @param y moment
 * @returns 是否
 */
export function lt(x: Moment, y: Moment): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isMomentArray([x, y])) throwException(13)
  if (!isValidMomentArray([x, y])) throwException(9)
  return mathLt(x.valueOf(), y.valueOf())
}

/**
 * 日期：判断相等
 * @param x moment
 * @param x moment
 * @returns 是否
 */
export function eq(x: Moment, y: Moment): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isMomentArray([x, y])) throwException(13)
  if (!isValidMomentArray([x, y])) throwException(9)
  return mathEq(x.valueOf(), y.valueOf())
}

/**
 * 日期：判断相等
 * @param  {moment} x moment
 * @param {moment} x moment
 * @returns {boolean} 是否
 */
export function neq(x: Moment, y: Moment): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isMomentArray([x, y])) throwException(13)
  if (!isValidMomentArray([x, y])) throwException(9)
  return mathNeq(x.valueOf(), y.valueOf())
}

export default {
  date,
  Date: {
    now,
    get,
    set,
    diff,
    format,
    max,
    min,
    add,
    minus,
    gte,
    gt,
    lte,
    lt,
    eq,
    neq,
  },
}
