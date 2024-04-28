export enum FormulaNodeType {
  /** 文本 */
  TEXT = 1,
  /** 数字 */
  NUMBER = 2,
  /** 布尔 */
  BOOLEAN = 4,
  /** 时间日期 */
  DATETIME = 8,
  /** 分组 */
  GROUP = 16,
  /** 操作符 */
  OPERATOR = 32,
  /** 逗号 */
  COMMA = 64,
  /** 变量 */
  VARIABLE = 128,
  /** 函数 */
  METHOD = 256
}

export interface FormulaNode<T = any> {
  /** 节点类型 */
  type: FormulaNodeType;
  /** 节点在文本中的位置 */
  index: number;
  /** 节点对应的文本 */
  chars: string;
  /** 内容 */
  content: T;
}

export interface FormulaOperatorNode extends FormulaNode {
  type: FormulaNodeType.OPERATOR;
  content: { type: string };
}

export interface FormulaVariableNode extends FormulaNode {
  type: FormulaNodeType.VARIABLE;
  content: { key: string };
}

export interface FormulaMethodNode extends FormulaNode {
  type: FormulaNodeType.METHOD;
  content: {
    name: string;
    params: FormulaNode[];
    result: any;
  };
}

export interface FormulaTextNode extends FormulaNode {
  type: FormulaNodeType.TEXT;
  content: {
    value: string;
  };
}

export interface FormulaNumberNode extends FormulaNode {
  type: FormulaNodeType.NUMBER;
  content: {
    value: number;
  };
}

export interface FormulaBooleanNode extends FormulaNode {
  type: FormulaNodeType.BOOLEAN;
  content: {
    value: boolean;
  };
}

export interface FormulaDateNode extends FormulaNode {
  type: FormulaNodeType.DATETIME;
  content: {
    value: Date;
  };
}

export type FormulaValueNode =
  | FormulaTextNode
  | FormulaNumberNode
  | FormulaBooleanNode
  | FormulaDateNode;

export interface FormulaCommaNode extends FormulaNode {
  type: FormulaNodeType.COMMA;
  content: {};
}

export interface FormulaGroupNode extends FormulaNode {
  type: FormulaNodeType.GROUP;
  content: { body: FormulaNode[] };
}

interface MethodInputOptions {
  type: FormulaNodeType;
  name: String;
  description?: string;
  required?: boolean;
}

interface MethodOuputOptions {
  type: FormulaNodeType;
  description?: string;
}

export interface FormulaPluginMethod {
  name: string;
  description: string;
  inputs: MethodInputOptions[];
  output: MethodOuputOptions;
  method: any;
}

export interface FormulaPluginVariable {
  name: string;
  description: string;
  type: FormulaNodeType;
  value: any;
}

export interface FormulaPlugin {
  name: string;
  methods?: FormulaPluginMethod[];
  constants?: FormulaPluginVariable[];
}
