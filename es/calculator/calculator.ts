import type {
  FormulaNode,
  FormulaNumberNode,
  FormulaValueNode
} from 'es/interface';
import { FormulaNodeType } from 'es/interface';
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
  div
} from 'es/plugins/math';
import {
  cloneNodes,
  createMethodNode,
  createNodeByType,
  getNodeTypeString,
  isGroupNode,
  isMethodNode,
  isOperatorNode,
  isValueNode,
  isVariableNode
} from 'es/node';
import { MethodManager } from 'es/utils/method-manager';
import { VariableManager } from 'es/utils/variable-manager';
import { ExceptionType, createException } from 'es/utils/exception';

// 运算符对应函数
const OPERATOR_MAP = {
  '>': gt,
  '>=': gte,
  '<': lt,
  '<=': lte,
  '==': eq,
  '!=': neq,
  '+': add,
  '-': minus,
  '*': multi,
  '/': div
};

export const createCalculator = (
  methodManager: MethodManager,
  variableManager: VariableManager
) => {
  return async function calculator(
    source: FormulaNode[],
    tempVars: Record<string, any>
  ): Promise<FormulaValueNode> {
    source = cloneNodes(source);
    const stack: FormulaValueNode[] = [];
    const len = source.length;
    for (let index = 0; index < len; index++) {
      const node = source[index];
      if (isValueNode(node)) {
        stack.push(node);
      } else if (isVariableNode(node)) {
        const { key } = node.content;
        const result = tempVars.hasOwnProperty(key)
          ? tempVars[key]
          : variableManager.get(key);
        stack.push(createNodeByType(node.index, node.chars, result));
      } else if (isOperatorNode(node)) {
        const n1 = stack.pop() as FormulaNumberNode;
        const n2 = stack.pop() as FormulaNumberNode;
        const chars = `${n1.chars}${node.chars}${n2.chars}`;
        /** 校验类型：操作符只作用在数字上 */
        if (n1.type !== FormulaNodeType.NUMBER) {
          throw createException(
            ExceptionType.NotAssignableParameter,
            getNodeTypeString(n1.type),
            getNodeTypeString(FormulaNodeType.NUMBER)
          );
        }
        if (n2.type !== FormulaNodeType.NUMBER) {
          throw createException(
            ExceptionType.NotAssignableParameter,
            getNodeTypeString(n2.type),
            getNodeTypeString(FormulaNodeType.NUMBER)
          );
        }
        try {
          const operatorType = node.content.type;
          const operator =
            OPERATOR_MAP[operatorType as keyof typeof OPERATOR_MAP];
          const res = operator(n1.content.value, n2.content.value);
          stack.push(createNodeByType(n1.index, chars, res));
        } catch (err: any) {
          throw createException(ExceptionType.Custom, chars, err.message);
        }
      } else if (isGroupNode(node)) {
        const result = await calculator(node.content.body, tempVars);
        stack.push(result);
      } else if (isMethodNode(node)) {
        const { name, params } = node.content;
        const newParams: FormulaValueNode[] = [];
        for (const param of params) {
          if (
            param.type === FormulaNodeType.GROUP ||
            param.type === FormulaNodeType.METHOD ||
            param.type === FormulaNodeType.VARIABLE
          ) {
            // 函数，组合，变量需要转为具体的数据
            const {
              content: { value }
            } = await calculator([param], tempVars);
            newParams.push(createNodeByType(param.index, param.chars, value));
          } else {
            newParams.push(param as FormulaValueNode);
          }
        }
        const result = await methodManager.call(
          createMethodNode(node.index, node.chars, name, newParams)
        );
        stack.push(result);
      }
    }
    return stack[0];
  };
};
