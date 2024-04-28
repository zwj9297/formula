import * as assert from './assert';
import {
  createCommaNode,
  createGroupNode,
  createMethodNode,
  createNumberNode,
  createOperatorNode,
  createTextNode,
  createVariableNode,
  isCommaNode,
  isGroupNode,
  isMethodNode,
  isOperatorNode,
  isValueNode,
  isVariableNode
} from 'es/node';
import type {
  FormulaGroupNode,
  FormulaMethodNode,
  FormulaNode,
  FormulaOperatorNode
} from 'es/interface';
import { FormulaNodeType } from 'es/interface';
import { BaseState, TokenizeState } from './state';
import { ExceptionType, createException } from 'es/utils/exception';

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
  '/': 3
};

class BaseStateImpl implements BaseState {
  /** 组合层级：以`()`进行分组，组合可以嵌套 */
  depth = 0;
  /** 最后一个的节点 */
  last: FormulaNode | null = null;
  /** 结果 */
  resolve: FormulaNode[] = [];
  tokenize = tokenizeBase;
}

export class TokenizeStateImpl extends BaseStateImpl implements TokenizeState {
  /** 分析的文本 */
  text: string;

  /** 当前分析字符下标 */
  index = 0;

  /** 缓存栈 */
  stack: BaseState[] = [];

  completed = false;

  /** 下钻 */
  sink() {
    const { depth, last, resolve, tokenize } = this;
    // 将当前层级的信息缓存起来
    this.stack.push({ depth, last, resolve, tokenize });
    // 重新开始分析
    Object.assign(this, {
      depth: this.depth + 1,
      last: null,
      resolve: [],
      tokenize: tokenizeBase
    });
    return this;
  }

  /** 上升 */
  surface() {
    // 弹出缓存的上一层的信息，覆盖
    Object.assign(this, this.stack.pop());
    return this;
  }

  push(node: FormulaNode) {
    this.last = node;
    this.resolve.push(this.last);
    this.tokenize = tokenizeBase;
  }

  constructor(text: string) {
    super();
    this.text = text;
  }
}

/** 组合分析函数 */
function setTokenizeGroup(state: TokenizeState) {
  const originIndex = state.index;
  state.push(createGroupNode(state.index, '()', []));
  state.index++;
  // 将 tokenize 设置为组合分析结束函数，待会下钻前会将其缓存
  state.tokenize = function tokenizeGroupEnd(
    state: TokenizeState,
    value: FormulaNode[] = []
  ) {
    const last = this.resolve[this.resolve.length - 1] as FormulaGroupNode;
    last.content.body = value;
    last.chars = this.text.substring(originIndex, this.index + 1);
    state.tokenize = function tokenizeGroup(state: TokenizeState) {
      const ch = this.text.charAt(this.index);
      if (assert.isGroupEnd(state, ch)) {
        this.index++;
        this.tokenize = tokenizeBase;
      } else if (assert.isEmpty(state, ch)) {
        throw createException(ExceptionType.UnexpectedGroupEnd);
      }
    };
  };
  // 开始下钻
  state.sink();
}

/** 数字分析函数 */
function setTokenizeNumber(state: TokenizeState, sign = '') {
  let n = '';
  let hasDecimal = false; // 是否有小数点
  let isScientific = false; // 是否科学计数法
  const originIndex = state.index;
  state.tokenize = function tokenNumber(state: TokenizeState) {
    const ch = state.text.charAt(state.index);
    if (assert.isNumber(state, ch)) {
      // 数字直接添加进去
      n += ch;
      state.index++;
    } else if (assert.isDecimalPoint(state, ch)) {
      // 小数点需要判断前面是否已存在小数点 或 是否是科学计数法
      if (hasDecimal || isScientific) {
        throw createException(ExceptionType.UnexpectedType, 'number');
      }
      hasDecimal = true;
      n += ch;
      state.index++;
    } else if (ch === 'e') {
      if (isScientific) {
        throw createException(ExceptionType.InvalidToken);
      }
      // 是e则进入科学计数法的解析
      isScientific = true;
      n += ch;
      state.index++;
    } else {
      if (
        ch &&
        // 不是操作符
        !assert.isOperator(state, ch) &&
        // 不是函数内的入参
        !(
          assert.isIn(state, FormulaNodeType.METHOD) &&
          (assert.isComma(state, ch) || assert.isGroupEnd(state, ch))
        ) &&
        // 不是组合里的数据
        !(
          assert.isIn(state, FormulaNodeType.GROUP) &&
          assert.isGroupEnd(state, ch)
        )
      ) {
        throw createException(ExceptionType.UnexpectedEnd);
      } else if (!n.length) {
        // 没有解析到数字
        throw createException(ExceptionType.UnexpectedEnd);
      } else if (!/^([1-9][0-9]*|0)?(\.\d*)?(e[\+\-]?\d+)?$/.test(n)) {
        // 不是数值或科学计数法的数值
        throw createException(ExceptionType.InvalidToken);
      } else if (!Number.isFinite(Number(n))) {
        // 超过系统最大可显示的数值
        throw createException(ExceptionType.WillBeInfinity);
      }
      state.push(createNumberNode(originIndex, sign + n, Number(sign + n)));
    }
  };
}

/** 操作符分析函数 */
function setTokenizeOperator(state: TokenizeState) {
  let operator = '';
  const originIndex = state.index;
  state.tokenize = function tokenOperator(state: TokenizeState) {
    let ch = state.text.charAt(state.index);
    if (assert.isOperator(state, ch)) {
      operator += ch;
      state.index++;
    } else if (OPERATOR_WEIGHT.hasOwnProperty(operator)) {
      if (
        /[\+\-]/.test(operator) /** 以正负号开头 */ &&
        (assert.isBegin(state) /** 作为表达式开头 */ ||
          assert.isBehind(
            state,
            FormulaNodeType.OPERATOR
          ) /** 跟随表达式后面 */ ||
          (assert.isIn(state, FormulaNodeType.METHOD) &&
            assert.isBehind(
              state,
              FormulaNodeType.COMMA
            ))) /** 在函数里且在逗号后面 */
      ) {
        setTokenizeNumber(state, operator);
      } else if (
        assert.isBehind(
          state,
          FormulaNodeType.NUMBER |
            FormulaNodeType.GROUP |
            FormulaNodeType.VARIABLE |
            FormulaNodeType.METHOD
        )
      ) {
        state.push(createOperatorNode(originIndex, operator, operator));
      } else {
        throw createException(ExceptionType.UnexpectedToken, operator);
      }
    } else {
      throw createException(ExceptionType.UnexpectedToken, operator);
    }
  };
}

/** 文本分析函数 */
function setTokenizeText(state: TokenizeState, qm: "'" | '"') {
  let str = '';
  const originIndex = state.index;
  state.index++;
  state.tokenize = function tokenizeText(state: TokenizeState) {
    const ch = state.text.charAt(state.index);
    if (ch === '') {
      throw createException(ExceptionType.UnexpectedEnd);
    } else if (ch === qm) {
      if (assert.isBegin(state) || assert.isIn(state, FormulaNodeType.METHOD)) {
        state.push(createTextNode(originIndex, `${qm}${str}${qm}`, str));
      } else if (assert.isBehind(state, FormulaNodeType.OPERATOR)) {
        throw createException(ExceptionType.UnexpectedType, 'number');
      } else {
        throw createException(ExceptionType.UnexpectedType, 'string');
      }
    } else {
      str += ch;
    }
    state.index++;
  };
}

/** 变量分析函数 */
function setTokenVariable(state: TokenizeState) {
  let key = '';
  const originIndex = state.index;
  state.index++;
  state.tokenize = function TokenVariable(state: TokenizeState) {
    const ch = state.text.charAt(state.index);
    if (ch === '}') {
      if (assert.isEmpty(state, key))
        throw createException(ExceptionType.VariableNameEmpty);
      state.push(createVariableNode(originIndex, `{${key}}`, key));
    } else if (assert.isEmpty(state, ch)) {
      throw createException(ExceptionType.UnexpectedEnd);
    } else {
      key += ch;
    }
    state.index++;
  };
}

/** 函数分析函数 */
function setTokenizeMethod(state: TokenizeState) {
  let name = '';
  let readName = true;
  const originIndex = state.index;
  state.index++;
  const toGroup = (resolve: FormulaNode[]) => {
    if (resolve.length > 1) {
      const startIndex = resolve[0].index;
      const endItem = resolve[resolve.length - 1];
      const endIndex = endItem.index + endItem.chars.length;
      return createGroupNode(
        startIndex,
        state.text.substring(startIndex, endIndex),
        [...resolve]
      );
    } else {
      return resolve[0];
    }
  };
  state.tokenize = function tokenizeMethod(state: TokenizeState) {
    const ch = state.text.charAt(state.index);
    if (assert.isGroupStart(state, ch)) {
      if (!name.length) {
        throw createException(ExceptionType.FunctionNameEmpty);
      }
      state.push(createMethodNode(originIndex, name, name, []));
      state.index++;
      readName = false;
      state.tokenize = function tokenizeMethodEnd(
        state: TokenizeState,
        value: FormulaNode[] = []
      ) {
        let i = 0;
        let cache = [];
        const newValue = [];
        if (value && value.length) {
          while (i < value.length) {
            const v = value[i];
            if (isCommaNode(v)) {
              if (!cache.length) {
                throw createException(ExceptionType.UnexpectedToken, ',');
              } else {
                newValue.push(toGroup(cache));
              }
              cache = [];
            } else {
              cache.push(v);
            }
            i++;
          }
        }
        if (cache.length) newValue.push(toGroup(cache));
        const last = state.resolve[
          state.resolve.length - 1
        ] as FormulaMethodNode;
        last.content.params = newValue;
        last.chars = state.text.substring(originIndex, this.index + 1);
        state.tokenize = tokenizeMethod;
      };
      state.sink();
    } else if (assert.isGroupEnd(state, ch)) {
      state.index++;
      state.tokenize = tokenizeBase;
    } else if (!assert.isEmpty(state, ch)) {
      name += ch;
      state.index++;
    } else {
      if (readName) {
        if (!assert.isEmpty(state, ch)) {
          name += ch;
          state.index++;
        } else if (name) {
          throw createException(ExceptionType.NotCalled, name);
        } else {
          throw createException(ExceptionType.UnexpectedToken, '$');
        }
      } else {
        throw createException(ExceptionType.UnexpectedEnd);
      }
    }
  };
}

function tokenizeBase(
  state: TokenizeState,
  _nodes?: FormulaNode[]
): false | void {
  const ch = state.text.charAt(state.index);
  if (assert.isEmpty(state, ch)) {
    if (state.stack.length) {
      const { resolve } = state;
      state.surface().tokenize(state, resolve);
    } else {
      if (state.last && isOperatorNode(state.last)) {
        throw createException(ExceptionType.UnexpectedEnd);
      }
      state.completed = true;
      return false;
    }
  } else if (assert.isSpace(state, ch)) {
    state.index++;
  } else if (assert.isGroupStart(state, ch)) {
    if (
      !assert.isBegin(state) &&
      !assert.isBehind(state, FormulaNodeType.OPERATOR)
    ) {
      throw createException(ExceptionType.NotAFunction, state.last!.chars);
    }
    setTokenizeGroup(state);
  } else if (assert.isGroupEnd(state, ch)) {
    const { resolve } = state;
    if (!assert.isIn(state, FormulaNodeType.GROUP | FormulaNodeType.METHOD)) {
      throw createException(ExceptionType.UnexpectedToken, ch);
    }
    if (assert.isIn(state, FormulaNodeType.GROUP) && !resolve.length) {
      throw createException(ExceptionType.GroupEmpty);
    }
    state.surface().tokenize(state, resolve);
  } else if (assert.isNumber(state, ch) || assert.isDecimalPoint(state, ch)) {
    if (
      assert.isBegin(state) ||
      assert.isBehind(state, FormulaNodeType.OPERATOR) ||
      (assert.isIn(state, FormulaNodeType.METHOD) &&
        assert.isBehind(state, FormulaNodeType.COMMA))
    ) {
      setTokenizeNumber(state);
    } else {
      throw createException(ExceptionType.UnexpectedType, 'number');
    }
  } else if (assert.isOperator(state, ch)) {
    setTokenizeOperator(state);
  } else if (assert.isText(state, ch)) {
    if (assert.isBehind(state, FormulaNodeType.OPERATOR)) {
      throw createException(ExceptionType.StringFollowOperator);
    }
    setTokenizeText(state, ch);
  } else if (assert.isVariable(state, ch)) {
    setTokenVariable(state);
  } else if (assert.isMethod(state, ch)) {
    setTokenizeMethod(state);
  } else if (assert.isComma(state, ch)) {
    if (assert.isIn(state, FormulaNodeType.METHOD)) {
      state.push(createCommaNode(state.index, ch));
      state.index++;
    } else {
      throw createException(ExceptionType.UnexpectedToken, ',');
    }
  } else {
    throw createException(ExceptionType.UnexpectedToken, ch);
  }
}

// 运算符权重
const OPERATOR_MAP: Record<string, number> = {
  '>': 1,
  '>=': 1,
  '<': 1,
  '<=': 1,
  '==': 1,
  '!=': 1,
  '+': 2,
  '-': 2,
  '*': 3,
  '/': 3
};

const convertInfix2prefix = (source: FormulaNode[]): FormulaNode[] => {
  const stack1: FormulaNode[] = [];
  const stack2: FormulaNode[] = [];
  let len = source.length;
  while (len--) {
    const target = source[len];
    if (isValueNode(target) || isVariableNode(target)) {
      stack2.push(target);
    } else if (isGroupNode(target)) {
      target.content.body = convertInfix2prefix(target.content.body);
      stack2.push(target);
    } else if (isMethodNode(target)) {
      const stack3: FormulaMethodNode[] = [target];
      while (stack3.length) {
        const current = stack3.shift() as FormulaMethodNode;
        current.content.params.forEach((param) => {
          if (isMethodNode(param)) {
            stack3.push(param);
          } else if (isGroupNode(param)) {
            (param as FormulaGroupNode).content.body = convertInfix2prefix(
              param.content.body
            );
          }
        });
      }
      stack2.push(target);
    } else if (isOperatorNode(target)) {
      // 遇到运算符
      let loop = true;
      while (loop) {
        const last = stack1.pop();
        if (!last) {
          stack1.push(target);
          loop = false;
        } else if (
          OPERATOR_MAP[target.content.type] >=
          OPERATOR_MAP[(last as FormulaOperatorNode).content.type]
        ) {
          stack1.push(last, target);
          loop = false;
        } else {
          stack2.push(last);
        }
      }
    }
  }
  while (stack1.length) {
    stack2.push(stack1.pop() as FormulaNode);
  }
  return stack2;
};

export const createTokenizer = () => {
  const cache: Record<string, FormulaNode[]> = {};
  return async function tokenizer(text: string) {
    const text$1 = text.trim();
    if (!cache.hasOwnProperty(text$1)) {
      const state = new TokenizeStateImpl(text$1);
      while (!state.completed) {
        state.tokenize(state);
      }
      cache[text$1] = convertInfix2prefix(state.resolve);
    }
    return Promise.resolve(cache[text$1]);
  };
};
