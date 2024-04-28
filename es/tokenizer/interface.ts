import type { FormulaNode } from 'es/interface';

export interface BaseState {
  /** 组合层级：以`()`进行分组，组合可以嵌套 */
  depth: number;
  /** 最后一个的节点 */
  last: FormulaNode | null;
  /** 结果 */
  resolve: FormulaNode[];
  tokenize: (state: TokenizeState, nodes?: FormulaNode[]) => false | void;
}

export interface TokenizeState extends BaseState {
  /** 分析的文本 */
  text: string;

  /** 当前分析字符下标 */
  index: number;

  /** 缓存栈 */
  stack: BaseState[];

  /** 是否完成 */
  completed: boolean;

  /** 下钻 */
  sink(): this;

  /** 上升 */
  surface(): this;

  push(node: FormulaNode): void;
}
