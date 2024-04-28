import Big from 'big.js';
import { FormulaPlugin, FormulaNodeType } from 'es/interface';
import { ExceptionType, createException } from 'es/utils/exception';

/**
 * 数值相加
 */
export function add(x: number, y: number): number {
  const res = new Big(x).add(y).toNumber();
  if (!Number.isFinite(res)) {
    throw createException(ExceptionType.WillBeInfinity);
  }
  return res;
}

/**
 * 数值相减
 */
export function minus(x: number, y: number): number {
  const res = new Big(x).minus(y).toNumber();
  if (!Number.isFinite(res)) {
    throw createException(ExceptionType.WillBeInfinity);
  }
  return res;
}

/**
 * 数值相乘
 */
export function multi(x: number, y: number): number {
  const res = new Big(x).mul(y).toNumber();
  if (!Number.isFinite(res)) {
    throw createException(ExceptionType.WillBeInfinity);
  }
  return res;
}

/**
 * 数值相除
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

const GlobalMath = globalThis.Math;

export const Math: FormulaPlugin = {
  name: 'Math',
  methods: [
    {
      name: 'add',
      description: '数值相加',
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
        type: FormulaNodeType.NUMBER
      },
      method: add
    },
    {
      name: 'minus',
      description: '数值相减',
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
        type: FormulaNodeType.NUMBER
      },
      method: minus
    },
    {
      name: 'multi',
      description: '数值相乘',
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
        type: FormulaNodeType.NUMBER
      },
      method: multi
    },
    {
      name: 'div',
      description: '数值相除',
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
        type: FormulaNodeType.NUMBER
      },
      method: div
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
    },
    {
      name: 'average',
      description: '求平均值',
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
        type: FormulaNodeType.NUMBER
      },
      method: function average(x: number, y: number): number {
        return div(add(x, y), 2);
      }
    },
    {
      name: 'pow',
      description: '求幂',
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
        type: FormulaNodeType.NUMBER
      },
      method: function pow(x: number, y: number) {
        return x ** y;
      }
    },
    {
      name: 'fixed',
      description: '用定点小数格式',
      inputs: [
        {
          type: FormulaNodeType.NUMBER,
          name: 'value',
          required: true
        },
        {
          type: FormulaNodeType.NUMBER,
          name: 'decimals',
          required: true
        }
      ],
      output: {
        type: FormulaNodeType.TEXT
      },
      method: function fixed(value: number, decimals: number) {
        return value.toFixed(decimals);
      }
    }
  ],
  constants: [
    {
      name: 'PI',
      description: '圆周率',
      type: FormulaNodeType.NUMBER,
      value: GlobalMath.PI
    }
  ]
};
