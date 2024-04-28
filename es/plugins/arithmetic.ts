import Big from 'big.js';
import { FormulaPlugin, FormulaNodeType } from 'es/interface';
import { ExceptionType, createException } from 'es/utils/exception';

/**
 * 求和
 */
export function add(x: number, y: number): number {
  const res = new Big(x).add(y).toNumber();
  if (!Number.isFinite(res)) {
    throw createException(ExceptionType.WillBeInfinity);
  }
  return res;
}

/**
 * 求差
 */
export function minus(x: number, y: number): number {
  const res = new Big(x).minus(y).toNumber();
  if (!Number.isFinite(res)) {
    throw createException(ExceptionType.WillBeInfinity);
  }
  return res;
}

/**
 * 求积
 */
export function multi(x: number, y: number): number {
  const res = new Big(x).mul(y).toNumber();
  if (!Number.isFinite(res)) {
    throw createException(ExceptionType.WillBeInfinity);
  }
  return res;
}

/**
 * 求商
 */
export function div(x: number, y: number): number {
  const res = new Big(x).div(y).toNumber();
  if (!Number.isFinite(res)) {
    throw createException(ExceptionType.WillBeInfinity);
  }
  return res;
}

/**
 * 判断大于等于
 */
export function gte(x: number, y: number): boolean {
  return new Big(x).gte(y);
}

/**
 * 判断大于
 */
export function gt(x: number, y: number): boolean {
  return new Big(x).gt(y);
}

/**
 * 判断小于等于
 */
export function lte(x: number, y: number): boolean {
  return new Big(x).lte(y);
}

/**
 * 判断小于
 */
export function lt(x: number, y: number): boolean {
  return new Big(x).lt(y);
}

/**
 * 判断相等
 */
export function eq(x: number, y: number): boolean {
  return new Big(x).eq(y);
}

/**
 * 判断不相等
 */
export function neq(x: number, y: number): boolean {
  return !new Big(x).eq(y);
}

export const Arithmetic: FormulaPlugin = {
  name: 'Arithmetic',
  methods: [
    {
      name: 'add',
      description: '求和',
      inputs: [
        {
          type: FormulaNodeType.NUMBER,
          name: 'x',
          description: '被加数',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'y',
          description: '加数',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '和'
      },
      method: add
    },
    {
      name: 'minus',
      description: '求差',
      inputs: [
        {
          type: FormulaNodeType.NUMBER,
          name: 'x',
          description: '被减数',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'y',
          description: '减数',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '差'
      },
      method: minus
    },
    {
      name: 'multi',
      description: '求积',
      inputs: [
        {
          type: FormulaNodeType.NUMBER,
          name: 'x',
          description: '被乘数',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'y',
          description: '乘数',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '积'
      },
      method: multi
    },
    {
      name: 'div',
      description: '求商',
      inputs: [
        {
          type: FormulaNodeType.NUMBER,
          name: 'x',
          description: '被除数',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'y',
          description: '除数',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '商'
      },
      method: div
    },
    {
      name: 'pow',
      description: '求幂',
      inputs: [
        {
          type: FormulaNodeType.NUMBER,
          name: 'x',
          description: '底数',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'y',
          description: '指数',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER,
        description: '幂'
      },
      method: function pow(x: number, y: number) {
        return x ** y;
      }
    },
    {
      name: 'gte',
      description: '判断大于等于',
      inputs: [
        {
          type: FormulaNodeType.NUMBER,
          name: 'x',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'y',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.BOOLEAN
      },
      method: gte
    },
    {
      name: 'gt',
      description: '判断大于',
      inputs: [
        {
          type: FormulaNodeType.NUMBER,
          name: 'x',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'y',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.BOOLEAN
      },
      method: gt
    },
    {
      name: 'lte',
      description: '判断小于等于',
      inputs: [
        {
          type: FormulaNodeType.NUMBER,
          name: 'x',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'y',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.BOOLEAN
      },
      method: lte
    },
    {
      name: 'lt',
      description: '判断小于',
      inputs: [
        {
          type: FormulaNodeType.NUMBER,
          name: 'x',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'y',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.BOOLEAN
      },
      method: lt
    },
    {
      name: 'eq',
      description: '判断相等',
      inputs: [
        {
          type: FormulaNodeType.NUMBER,
          name: 'x',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'y',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.BOOLEAN
      },
      method: eq
    },
    {
      name: 'neq',
      description: '判断不相等',
      inputs: [
        {
          type: FormulaNodeType.NUMBER,
          name: 'x',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'y',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.BOOLEAN
      },
      method: neq
    },
    {
      name: 'number',
      description: '转为数值',
      inputs: [
        {
          type:
            FormulaNodeType.TEXT |
            FormulaNodeType.NUMBER |
            FormulaNodeType.BOOLEAN |
            FormulaNodeType.DATETIME,
          name: 'value'
        }
      ],
      output: {
        type: FormulaNodeType.NUMBER
      },
      method: function toNumber(
        value: string | number | boolean | Date
      ): number {
        if (typeof value === 'number') {
          return value;
        }
        if (Number.isNaN(Number(value))) {
          throw createException(ExceptionType.UnexpectedType, 'number');
        }
        return Number(value);
      }
    }
  ]
};
