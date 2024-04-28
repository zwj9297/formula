import { FormulaNodeType } from 'es/interface';
import type {
  FormulaBooleanNode,
  FormulaCommaNode,
  FormulaDateNode,
  FormulaGroupNode,
  FormulaMethodNode,
  FormulaNode,
  FormulaNumberNode,
  FormulaOperatorNode,
  FormulaTextNode,
  FormulaValueNode,
  FormulaVariableNode
} from 'es/interface';
import { ExceptionType, createException } from 'es/utils/exception';

/**
 * 创建节点
 * @param type 节点类型
 * @param index 节点在文本中的位置
 * @param value 节点内容
 * @param chars 节点对应的文本
 * @return 节点对象
 */
export const createNode = <T extends FormulaNode['content']>(
  type: FormulaNodeType,
  index: number,
  chars: string,
  content: T
): FormulaNode => {
  return { type, index, chars, content };
};

export const createOperatorNode = (
  index: number,
  chars: string,
  type: string
) => {
  return createNode(FormulaNodeType.OPERATOR, index, chars, {
    type
  }) as FormulaOperatorNode;
};

export const createVariableNode = (
  index: number,
  chars: string,
  key: string
) => {
  return createNode(FormulaNodeType.VARIABLE, index, chars, {
    key
  }) as FormulaVariableNode;
};

export const createMethodNode = (
  index: number,
  chars: string,
  name: string,
  params: FormulaNode[]
) => {
  return createNode(FormulaNodeType.METHOD, index, chars, {
    name,
    params
  }) as FormulaMethodNode;
};

export const createTextNode = (index: number, chars: string, value: string) => {
  return createNode(FormulaNodeType.TEXT, index, chars, {
    value
  }) as FormulaTextNode;
};

export const createNumberNode = (
  index: number,
  chars: string,
  value: number
) => {
  return createNode(FormulaNodeType.NUMBER, index, chars, {
    value
  }) as FormulaNumberNode;
};

export const createBooleanNode = (
  index: number,
  chars: string,
  value: boolean
) => {
  return createNode(FormulaNodeType.BOOLEAN, index, chars, {
    value
  }) as FormulaBooleanNode;
};

export const createDatetimeNode = (
  index: number,
  chars: string,
  value: Date
) => {
  return createNode(FormulaNodeType.DATETIME, index, chars, {
    value
  }) as FormulaDateNode;
};

export const createCommaNode = (index: number, chars: string) => {
  return createNode(
    FormulaNodeType.COMMA,
    index,
    chars,
    {}
  ) as FormulaCommaNode;
};

export const createGroupNode = (
  index: number,
  chars: string,
  body: FormulaNode[]
) => {
  return createNode(FormulaNodeType.GROUP, index, chars, {
    body
  }) as FormulaGroupNode;
};

export const isValueMatchNodeType = (
  value: string | number | boolean | Date,
  nodeType: FormulaNodeType
) => {
  return (
    (typeof value === 'string' && nodeType === FormulaNodeType.TEXT) ||
    (typeof value === 'number' && nodeType === FormulaNodeType.NUMBER) ||
    (typeof value === 'boolean' && nodeType === FormulaNodeType.BOOLEAN) ||
    (value instanceof Date && nodeType === FormulaNodeType.DATETIME)
  );
};

export const createNodeByType = (
  index: number,
  chars: string,
  value: string | number | boolean | Date
) => {
  if (typeof value === 'number') {
    return createNumberNode(index, chars, value);
  } else if (typeof value === 'boolean') {
    return createBooleanNode(index, chars, value);
  } else if (typeof value === 'string') {
    return createTextNode(index, chars, value);
  } else if (value instanceof Date) {
    return createDatetimeNode(index, chars, value);
  }
  throw createException(ExceptionType.InvalidData);
};

export const isTextNode = (node: FormulaNode): node is FormulaTextNode => {
  return node.type === FormulaNodeType.TEXT;
};

export const isNumberNode = (node: FormulaNode): node is FormulaNumberNode => {
  return node.type === FormulaNodeType.NUMBER;
};

export const isBooleanNode = (
  node: FormulaNode
): node is FormulaBooleanNode => {
  return node.type === FormulaNodeType.BOOLEAN;
};

export const isDatetimeNode = (node: FormulaNode): node is FormulaDateNode => {
  return node.type === FormulaNodeType.DATETIME;
};

export const isValueNode = (node: FormulaNode): node is FormulaValueNode => {
  return (
    isTextNode(node) ||
    isNumberNode(node) ||
    isBooleanNode(node) ||
    isDatetimeNode(node)
  );
};

export const isGroupNode = (node: FormulaNode): node is FormulaGroupNode => {
  return node.type === FormulaNodeType.GROUP;
};

export const isVariableNode = (
  node: FormulaNode
): node is FormulaVariableNode => {
  return node.type === FormulaNodeType.VARIABLE;
};

export const isCommaNode = (node: FormulaNode): node is FormulaCommaNode => {
  return node.type === FormulaNodeType.COMMA;
};

export const isMethodNode = (node: FormulaNode): node is FormulaMethodNode => {
  return node.type === FormulaNodeType.METHOD;
};

export const isOperatorNode = (
  node: FormulaNode
): node is FormulaOperatorNode => {
  return node.type === FormulaNodeType.OPERATOR;
};

export const getNodeTypeString = (type: FormulaNodeType) => {
  let typeStr = '';
  if (type & FormulaNodeType.TEXT) {
    typeStr += 'string';
  }
  if (type & FormulaNodeType.NUMBER) {
    typeStr += `${typeStr ? ' or ' : ''}number`;
  }
  if (type & FormulaNodeType.BOOLEAN) {
    typeStr += `${typeStr ? ' or ' : ''}boolean`;
  }
  if (type & FormulaNodeType.DATETIME) {
    typeStr += `${typeStr ? ' or ' : ''}date`;
  }
  if (!typeStr) {
    throw createException(ExceptionType.InvalidData);
  }
  return typeStr;
};

export function cloneNodes(nodes: FormulaNode[]): FormulaNode[] {
  return nodes.map((node) => {
    const { index, chars } = node;
    switch (true) {
      case isTextNode(node):
        return createTextNode(index, chars, node.content.value);
      case isNumberNode(node):
        return createNumberNode(index, chars, node.content.value);
      case isBooleanNode(node):
        return createBooleanNode(index, chars, node.content.value);
      case isDatetimeNode(node):
        return createDatetimeNode(index, chars, new Date(node.content.value));
      case isCommaNode(node):
        return createCommaNode(index, chars);
      case isOperatorNode(node):
        return createOperatorNode(index, chars, node.content.type);
      case isVariableNode(node):
        return createVariableNode(index, chars, node.content.key);
      case isMethodNode(node):
        const { name, params } = node.content;
        return createMethodNode(index, chars, name, cloneNodes(params));
      case isGroupNode(node):
        return createGroupNode(index, chars, cloneNodes(node.content.body));
      default:
        throw createException(ExceptionType.InvalidData);
    }
  });
}
