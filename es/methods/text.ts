import { throwException } from '../utils'
import {
  isNumber,
  isNumberArray,
  isValidNumber,
  isValidNumberArray,
} from './math'

/** 是否字符串 */
export const isText = (t: string): boolean => typeof t === 'string'
/** 是否字符串组成的数组 */
export const isTextArray = (ts: string[]): boolean => ts.every((t) => isText(t))

/**
 * 将多个字符串合并成一个
 * @param ...texts 多个字符串
 * @returns 合并后的字符串
 */
export function concat(...texts: string[]): string {
  if (texts.length < 2) throwException(100, 2)
  if (!isTextArray(texts)) throwException(4)
  return texts.join('')
}

/**
 * 返回一个字符串在另一个字符串中出现的起始位置（区分大小写）
 * @param find_text 源字符串
 * @param within_text 查找的字符串
 * @param start_num 开始查找的位置
 * @returns 第一次出现的位置
 */
export function find(find_text: string, within_text: string, start_num: number = 0): number {
  if (arguments.length < 2 || arguments.length > 3) throwException(101, 2, 3, arguments.length)
  if (!isTextArray([find_text, within_text])) throwException(4)
  if (!isNumber(start_num)) throwException(1)
  if (!isValidNumber(start_num)) throwException(11)
  return find_text.slice(start_num).indexOf(within_text)
}

/**
 * 判断字符串是否完全相等（区分大小写）
 * @param text1 源字符串
 * @param text2 比较的字符串
 * @returns 是否
 */
export function exact(text1: string, text2: string): boolean {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isTextArray([text1, text2])) throwException(4)
  return text1 === text2
}

/**
 * 从字符串指定位置开始切割出指定长度的字符串
 * @param {string} text 源字符串
 * @param {number} start_num 开始位置
 * @param {number} num_chars 字符个数
 * @return {string} 目标字符串
 */
export function mid(text: string, start_num: number, num_chars: number): string {
  if (arguments.length !== 3) throwException(101, 3, arguments.length)
  if (!isText(text)) throwException(4)
  if (!isNumberArray([start_num, num_chars])) throwException(1)
  if (
    !isValidNumberArray([start_num, num_chars]) ||
    start_num < 0 ||
    num_chars < 0
  )
    throwException(11)
  return text.slice(start_num, start_num + num_chars)
}

/**
 * 从字符串的第一个字符开始切割出指定长度的字符串
 * @param text 源字符串
 * @param num_chars 字符个数
 * @returns 目标字符串
 */
export function left(text: string, num_chars: number): string {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isText(text)) throwException(4)
  if (!isNumber(num_chars)) throwException(1)
  if (!isValidNumber(num_chars) || num_chars < 0) throwException(11)
  return mid(text, 0, num_chars)
}

/**
 * 从字符串的最后一个字符开始返回指定个数的字符
 * @param text 源字符串
 * @param num_chars 字符个数
 * @returns 目标字符串
 */
export function right(text: string, num_chars: number): string {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isText(text)) throwException(4)
  if (!isNumber(num_chars)) throwException(1)
  if (!isValidNumber(num_chars) || num_chars < 0) throwException(11)
  return text.slice(-num_chars)
}

/**
 * 返回字符串长度
 * @param text 源字符串
 * @returns 长度
 */
export function len(text: string): number {
  if (arguments.length !== 1) throwException(101, 1, arguments.length)
  if (!isText(text)) throwException(4)
  return text.length
}

/**
 * 将字符串中所有的字母转换成小写形式
 * @param text 源字符串
 * @returns 转换后的字符串
 */
export function lower(text: string): string {
  if (arguments.length !== 1) throwException(101, 1, arguments.length)
  if (!isText(text)) throwException(4)
  return text.toLocaleLowerCase()
}

/**
 * 将字符串中所有的字母转换成大写形式
 * @param text 源字符串
 * @returns 转换后的字符串
 */
export function upper(text: string): string {
  if (arguments.length !== 1) throwException(101, 1, arguments.length)
  if (!isText(text)) throwException(4)
  return text.toLocaleUpperCase()
}

/**
 * 将字符串中各英文单词的第一个字母转大写，其余转小写
 * @param text 源字符串
 * @returns 转换后的字符串
 */
export function proper(text: string): string {
  if (arguments.length !== 1) throwException(101, 1, arguments.length)
  if (!isText(text)) throwException(4)
  return text
    .split(' ')
    .map((t) => {
      if (!/^[A-Za-z]+$/.test(t)) return t
      return upper(t.charAt(0)) + lower(t.slice(1))
    })
    .join(' ')
}

/**
 * 替换字符串
 * @param text 源字符串
 * @param old_text 被替换的字符串
 * @param new_text 替换的字符串
 * @returns 替换后的字符串
 */
export function replace(text: string, old_text: string, new_text: string): string {
  if (arguments.length !== 3) throwException(101, 3, arguments.length)
  if (!isTextArray([text, old_text, new_text])) throwException(4)
  return text.replace(new RegExp(old_text, 'g'), new_text)
}

/**
 * 指定次数重复字符串
 * @param text 源字符串
 * @param count 重复次数
 * @returns 目标字符串
 */
export function rept(text: string, count: number): string {
  if (arguments.length !== 2) throwException(101, 2, arguments.length)
  if (!isText(text)) throwException(4)
  if (!isNumber(count)) throwException(1)
  if (!isValidNumber(count) || count < 0) throwException(11)
  return text.repeat(count)
}

/**
 * 删除字符串中多余的空格，但会在英文字符串中保留一个作为词与词之间分隔的空格
 * @param text 源字符串
 * @returns 目标字符串
 */
export function trim(text: string): string {
  if (arguments.length !== 1) throwException(101, 1, arguments.length)
  if (!isText(text)) throwException(4)
  return text.trim().split(/[ ]+/).join(' ')
}

/**
 * 将一个代表数值的字符串转换成数值
 * @param text 源字符串
 * @returns 数值
 */
export function value(text: string): number {
  if (arguments.length !== 1) throwException(101, 1, arguments.length)
  if (!isText(text)) throwException(4)
  const res = text !== '' ? Number(text) : NaN
  if (!isValidNumber(res)) throwException(11)
  return res
}

export default {
  value,
  Text: {
    concat,
    find,
    exact,
    mid,
    left,
    right,
    len,
    lower,
    upper,
    proper,
    replace,
    rept,
    trim,
  },
}
